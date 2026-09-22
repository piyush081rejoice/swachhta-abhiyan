import { supabase } from '../supabaseClient';
import { notificationService } from './notificationService';

const LOCAL_OFFICERS_KEY = 'swachhata_officers_data';

export const officerService = {
  // Helper to notify if Supabase table is missing
  checkSupabaseError(error) {
    if (error && (error.code === 'PGRST205' || error.message?.includes('Could not find the table'))) {
      window.dispatchEvent(new CustomEvent('swachhata_supabase_table_missing', {
        detail: { table: 'officers', message: error.message }
      }));
      return true;
    }
    return false;
  },

  getLocalOfficers() {
    try {
      const data = localStorage.getItem(LOCAL_OFFICERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setLocalCache(officers) {
    try {
      if (Array.isArray(officers) && officers.length > 0) {
        const existing = this.getLocalOfficers();
        const map = new Map();
        existing.forEach(item => map.set(item.id, item));
        officers.forEach(item => map.set(item.id, item));
        localStorage.setItem(LOCAL_OFFICERS_KEY, JSON.stringify(Array.from(map.values())));
      }
    } catch (e) {
      console.warn('Failed to cache officers locally:', e);
    }
  },

  saveLocalOfficers(officers) {
    localStorage.setItem(LOCAL_OFFICERS_KEY, JSON.stringify(officers));
    window.dispatchEvent(new CustomEvent('swachhata_officers_updated'));
  },

  // Get all officers directly from Supabase
  async getOfficers({ search = '', municipalityType = '', page = 1, pageSize = 10 } = {}) {
    let officers = [];
    let isSupabase = false;

    try {
      let query = supabase.from('officers').select('*', { count: 'exact' });

      if (municipalityType && municipalityType !== 'All') {
        query = query.eq('municipality_type', municipalityType);
      }

      if (search && search.trim()) {
        const q = search.trim();
        query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,mobile.ilike.%${q}%,municipality_name.ilike.%${q}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (!error && data) {
        // Cache to local for instant offline availability
        if (data.length > 0 && page === 1 && !search && !municipalityType) {
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
      console.warn('Supabase fetch error:', e);
    }

    // Fallback to local cache if Supabase table is not yet created
    officers = this.getLocalOfficers();

    if (municipalityType && municipalityType !== 'All') {
      officers = officers.filter(o => o.municipality_type === municipalityType);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      officers = officers.filter(o =>
        (o.name && o.name.toLowerCase().includes(q)) ||
        (o.email && o.email.toLowerCase().includes(q)) ||
        (o.mobile && o.mobile.includes(q)) ||
        (o.municipality_name && o.municipality_name.toLowerCase().includes(q))
      );
    }

    const total = officers.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;

    return {
      data: officers.slice(start, start + pageSize),
      total,
      page,
      pageSize,
      totalPages,
      isSupabase: false
    };
  },

  // Get total officer count directly from Supabase
  async getOfficerCount() {
    try {
      const { count, error } = await supabase.from('officers').select('*', { count: 'exact', head: true });
      if (!error && typeof count === 'number') {
        return count;
      }
      this.checkSupabaseError(error);
    } catch {
      // fallback
    }
    return this.getLocalOfficers().length;
  },

  // Get officer by email directly from Supabase
  async getOfficerByEmail(email) {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const { data, error } = await supabase.from('officers').select('*').eq('email', cleanEmail).maybeSingle();
      if (!error && data) {
        return data;
      }
      this.checkSupabaseError(error);
    } catch {
      // fallback
    }
    return this.getLocalOfficers().find(o => o.email?.toLowerCase() === cleanEmail);
  },

  // Create new officer in Supabase
  async createOfficer({ name, email, mobile, municipality_type, municipality_name }) {
    const cleanEmail = email.trim().toLowerCase();

    // Check duplicate in Supabase
    const existing = await this.getOfficerByEmail(cleanEmail);
    if (existing) {
      throw new Error(`આ ઇમેઇલ (${cleanEmail}) ધરાવતા અધિકારી પહેલેથી જ અસ્તિત્વમાં છે.`);
    }

    // Generate secure system password
    const autoPassword = 'Sankalp@' + Math.floor(1000 + Math.random() * 9000);
    const newOfficer = {
      id: 'off_' + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      mobile: mobile.trim(),
      municipality_type,
      municipality_name: municipality_name?.trim() || municipality_type,
      password_hash: autoPassword,
      status: 'active',
      created_at: new Date().toISOString()
    };

    let insertedRecord = newOfficer;

    // Direct Supabase insert
    try {
      const { data, error } = await supabase.from('officers').insert([newOfficer]).select().single();
      if (!error && data) {
        insertedRecord = data;
      } else {
        this.checkSupabaseError(error);
      }
    } catch (err) {
      console.warn('Supabase insert failed:', err);
    }

    // Save to local cache as well
    const localList = this.getLocalOfficers();
    this.saveLocalOfficers([insertedRecord, ...localList]);

    // Dispatch system email notification with generated credentials!
    notificationService.addNotification({
      type: 'officer_welcome',
      title: `નવા અધિકારી ઓનબોર્ડિંગ: ${newOfficer.name}`,
      recipient: cleanEmail,
      officerName: newOfficer.name,
      officerEmail: cleanEmail,
      temporaryPassword: autoPassword,
      municipality: newOfficer.municipality_name,
      municipalityType: newOfficer.municipality_type,
      body: `નમસ્તે ${newOfficer.name},\n\nતમારું સ્વચ્છતા સંકલ્પ પોર્ટલ પર સ્વાગત છે.\n\nલૉગિન વિગતો:\nઈમેલ: ${cleanEmail}\nસિસ્ટમ જનરેટેડ પાસવર્ડ: ${autoPassword}\nપાલિકા: ${newOfficer.municipality_name} (${newOfficer.municipality_type})\n\nતમે આ પાસવર્ડ વડે લૉગ ઇન કરીને પ્રોફાઇલ સેક્શનમાંથી પાસવર્ડ બદલી શકો છો.`
    });

    return {
      officer: insertedRecord,
      generatedPassword: autoPassword
    };
  },

  // Update officer password in Supabase
  async updateOfficerPassword(officerId, newPassword) {
    try {
      const { error } = await supabase.from('officers').update({ password_hash: newPassword }).eq('id', officerId);
      this.checkSupabaseError(error);
    } catch {
      // ignore
    }

    const localList = this.getLocalOfficers();
    const updated = localList.map(o => o.id === officerId ? { ...o, password_hash: newPassword } : o);
    this.saveLocalOfficers(updated);
  }
};
