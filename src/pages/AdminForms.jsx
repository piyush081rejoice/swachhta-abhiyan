import React, { useState, useEffect } from 'react';
import {
  FileText, Search, Filter, Eye, Download, CheckCircle,
  Building2, Landmark, Calendar, MapPin, UserCheck, Loader2
} from 'lucide-react';
import Pagination from '../components/Pagination';
import { sankalpService } from '../services/sankalpService';
import { pdfService } from '../services/pdfService';

export default function AdminForms({ onPreviewPdf, initialMunicipalityType = 'All' }) {
  const [forms, setForms] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(6);
  const [search, setSearch] = useState('');
  const [municipalityType, setMunicipalityType] = useState(initialMunicipalityType);
  const [ward, setWard] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchForms = async () => {
    setLoading(true);
    try {
      const res = await sankalpService.getForms({
        search,
        municipalityType: municipalityType === 'All' ? '' : municipalityType,
        ward,
        page,
        pageSize
      });
      setForms(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, [search, municipalityType, ward, page]);

  const handleQuickDownload = async (form) => {
    onPreviewPdf(form);
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="page-title">તમામ સ્વચ્છતા સંકલ્પ પત્રો (All Sankalp Patras)</h1>
            <span className="badge-count">કુલ {total} સંકલ્પો</span>
          </div>
          <p className="page-subtitle">
            રાજ્યના તમામ ફિલ્ડ અધિકારીઓ દ્વારા નાગરિકો પાસેથી ભરાવાયેલા સંકલ્પ પત્રો
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-card">
        <div className="filter-grid-forms">
          {/* Search */}
          <div>
            <label className="filter-label">શોધો (Search by Citizen, Mobile, Ward, Officer)</label>
            <div className="input-with-icon">
              <Search size={16} className="input-icon" />
              <input
                type="text"
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="નાગરિકનું નામ, મોબાઈલ, વોર્ડ નં, અથવા અધિકારીનું નામ..."
                className="form-input"
              />
            </div>
          </div>

          {/* Municipality Type Filter */}
          <div>
            <label className="filter-label">પાલિકાનો પ્રકાર (Municipality)</label>
            <div className="input-with-icon">
              <Filter size={16} className="input-icon" />
              <select
                value={municipalityType}
                onChange={e => {
                  setMunicipalityType(e.target.value);
                  setPage(1);
                }}
                className="form-input"
              >
                <option value="All">બધી પાલિકાઓ (All)</option>
                <option value="મહાનગરપાલિકા">મહાનગરપાલિકા (Mahanagarpalika)</option>
                <option value="નગરપાલિકા">નગરપાલિકા (Nagarpalika)</option>
              </select>
            </div>
          </div>

          {/* Ward filter */}
          <div>
            <label className="filter-label">વોર્ડ નં. (Ward)</label>
            <input
              type="text"
              value={ward}
              onChange={e => {
                setWard(e.target.value);
                setPage(1);
              }}
              placeholder="વોર્ડ નં."
              className="form-input"
            />
          </div>
        </div>
      </div>

      {/* Forms Table */}
      <div className="table-card">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>નાગરિકનું નામ (Citizen Name)</th>
                <th>સરનામું & વોર્ડ</th>
                <th>પાલિકા (Municipality)</th>
                <th>મુલાકાત લેનાર અધિકારી</th>
                <th>તારીખ</th>
                <th className="text-right">એક્શન્સ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-500">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2 text-emerald-600" />
                    સંકલ્પ પત્રો લોડ થઈ રહ્યા છે...
                  </td>
                </tr>
              ) : forms.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400">
                    કોઈ મેળ ખાતા સંકલ્પ પત્રો મળ્યા નથી.
                  </td>
                </tr>
              ) : (
                forms.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="font-bold text-slate-900 text-sm">
                        {item.citizen_name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        📞 {item.mobile_no}
                      </div>
                    </td>
                    <td>
                      <div className="text-xs font-semibold text-slate-800">
                        વોર્ડ નં.: {item.ward_no}
                      </div>
                      <div className="text-[11px] text-slate-500 max-w-xs truncate" title={item.address}>
                        {item.address}
                      </div>
                    </td>
                    <td>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        item.municipality_type?.includes('મહાનગર') || item.municipality_type?.includes('Mahanagar')
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {item.municipality_name}
                      </span>
                    </td>
                    <td>
                      <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                        <UserCheck size={13} className="text-emerald-600" />
                        <span>{item.officer_name}</span>
                      </div>
                    </td>
                    <td className="text-xs text-slate-500 font-medium">
                      {item.submission_date}
                    </td>
                   
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onPreviewPdf(item)}
                          className="btn-action-primary"
                          title="સંકલ્પ પત્ર PDF પ્રિવ્યૂ અને ડાઉનલોડ"
                        >
                          <Eye size={14} /> PDF જુઓ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
