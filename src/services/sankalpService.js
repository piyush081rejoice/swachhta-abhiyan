import { supabase } from '../supabaseClient';

const LOCAL_SANKALP_KEY = 'swachhata_sankalp_patras_data';

export const sankalpService = {
  checkSupabaseError(error) {
    if (error && (error.code === 'PGRST205' || error.message?.includes('Could not find the table'))) {
      window.dispatchEvent(new CustomEvent('swachhata_supabase_table_missing', {
        detail: { table: 'sankalp_patras', message: error.message }
      }));
      return true;
    }
    return false;
  },

  getLocalForms() {
    try {
      const data = localStorage.getItem(LOCAL_SANKALP_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setLocalCache(forms) {
    try {
      if (Array.isArray(forms) && forms.length > 0) {
        const existing = this.getLocalForms();
        const map = new Map();
        existing.forEach(item => map.set(item.id, item));
        forms.forEach(item => map.set(item.id, item));
        localStorage.setItem(LOCAL_SANKALP_KEY, JSON.stringify(Array.from(map.values())));
      }
    } catch (e) {
      console.warn('Failed to cache forms locally:', e);
    }
  },

  saveLocalForms(forms) {
    localStorage.setItem(LOCAL_SANKALP_KEY, JSON.stringify(forms));
    window.dispatchEvent(new CustomEvent('swachhata_forms_updated'));
  },

  // Save new Sankalp Patra directly to Supabase
  async submitForm(formData) {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const newRecord = {
      id: 'sp_' + Date.now(),
      citizen_name: formData.citizen_name.trim(),
      address: formData.address.trim(),
      ward_no: formData.ward_no.trim(),
      mobile_no: formData.mobile_no.trim(),
      signature_data: formData.signature_data,
      officer_id: formData.officer_id,
      officer_name: formData.officer_name,
      municipality_type: formData.municipality_type,
      municipality_name: formData.municipality_name,
      submission_date: formattedDate,
      created_at: new Date().toISOString()
    };

    let savedRecord = newRecord;

    // Direct Supabase insert
    try {
      const { data, error } = await supabase.from('sankalp_patras').insert([newRecord]).select().single();
      if (!error && data) {
        savedRecord = data;
      } else {
        this.checkSupabaseError(error);
      }
    } catch (err) {
      console.warn('Supabase insert failed:', err);
    }

    // Also update local cache
    const local = this.getLocalForms();
    this.saveLocalForms([savedRecord, ...local]);
    return savedRecord;
  },

  // Get forms with filters, search, and pagination directly from Supabase
  async getForms({
    officerId = null,
    search = '',
    municipalityType = '',
    ward = '',
    date = '',
    page = 1,
    pageSize = 10
  } = {}) {
    // Try Supabase directly
    try {
      let query = supabase.from('sankalp_patras').select('*', { count: 'exact' });

      if (officerId) {
        query = query.eq('officer_id', officerId);
      }
      if (municipalityType && municipalityType !== 'All') {
        query = query.eq('municipality_type', municipalityType);
      }
      if (ward && ward.trim()) {
        query = query.eq('ward_no', ward.trim());
      }
      if (search && search.trim()) {
        const q = search.trim();
        query = query.or(`citizen_name.ilike.%${q}%,address.ilike.%${q}%,mobile_no.ilike.%${q}%,officer_name.ilike.%${q}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (!error && data) {
        if (data.length > 0 && page === 1 && !officerId && !search) {
          this.setLocalCache(data);
        }
        return {
          data,
          total: count ?? data.length,
          page,
          pageSize,
          totalPages: Math.max(1, Math.ceil((count ?? data.length) / pageSize)),
          isSupabase: true
        };
      }

      this.checkSupabaseError(error);
    } catch (e) {
      console.warn('Supabase query failed:', e);
    }

    // Local fallback if Supabase table not created yet
    let forms = this.getLocalForms();

    if (officerId) {
      forms = forms.filter(f => f.officer_id === officerId);
    }

    if (municipalityType && municipalityType !== 'All') {
      forms = forms.filter(f => f.municipality_type === municipalityType);
    }

    if (ward) {
      forms = forms.filter(f => f.ward_no === ward);
    }

    if (date) {
      forms = forms.filter(f => f.submission_date === date);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      forms = forms.filter(f =>
        (f.citizen_name && f.citizen_name.toLowerCase().includes(q)) ||
        (f.address && f.address.toLowerCase().includes(q)) ||
        (f.mobile_no && f.mobile_no.includes(q)) ||
        (f.ward_no && f.ward_no.includes(q)) ||
        (f.officer_name && f.officer_name.toLowerCase().includes(q))
      );
    }

    const total = forms.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;

    return {
      data: forms.slice(start, start + pageSize),
      total,
      page,
      pageSize,
      totalPages,
      isSupabase: false
    };
  },

  // Get statistics directly from Supabase
  async getStats(officerId = null) {
    try {
      let query = supabase.from('sankalp_patras').select('*');
      if (officerId) {
        query = query.eq('officer_id', officerId);
      }
      const { data, error } = await query;
      if (!error && data) {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        const todayCount = data.filter(f => f.submission_date === formattedDate).length;
        const nagarpalikaCount = data.filter(f => f.municipality_type === 'નગરપાલિકા' || f.municipality_type === 'Nagarpalika').length;
        const mahanagarpalikaCount = data.filter(f => f.municipality_type === 'મહાનગરપાલિકા' || f.municipality_type === 'Mahanagarpalika').length;

        return {
          totalForms: data.length,
          todayForms: todayCount,
          nagarpalikaForms: nagarpalikaCount,
          mahanagarpalikaForms: mahanagarpalikaCount
        };
      }
    } catch {
      // fallback
    }

    const all = this.getLocalForms();
    const relevant = officerId ? all.filter(f => f.officer_id === officerId) : all;

    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const todayCount = relevant.filter(f => f.submission_date === formattedDate).length;
    const nagarpalikaCount = relevant.filter(f => f.municipality_type === 'નગરપાલિકા' || f.municipality_type === 'Nagarpalika').length;
    const mahanagarpalikaCount = relevant.filter(f => f.municipality_type === 'મહાનગરપાલિકા' || f.municipality_type === 'Mahanagarpalika').length;

    return {
      totalForms: relevant.length,
      todayForms: todayCount,
      nagarpalikaForms: nagarpalikaCount,
      mahanagarpalikaForms: mahanagarpalikaCount
    };
  }
};
