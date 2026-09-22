import React, { useState, useEffect } from 'react';
import {
  FileText, Search, Eye, Download, CheckCircle, PlusCircle, Loader2
} from 'lucide-react';
import Pagination from '../components/Pagination';
import { sankalpService } from '../services/sankalpService';

export default function OfficerForms({ user, onNavigate, onPreviewPdf }) {
  const [forms, setForms] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(6);
  const [search, setSearch] = useState('');
  const [ward, setWard] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchForms = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await sankalpService.getForms({
        officerId: user.id,
        search,
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
  }, [user, search, ward, page]);

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">મારા ભરેલા સંકલ્પ પત્રો (My Submitted Forms)</h1>
          <p className="page-subtitle">
            તમે ફિલ્ડ મુલાકાત દરમિયાન જમા કરાવેલા તમામ નાગરિક સંકલ્પ પત્રોની યાદી
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('new-form')}
          className="btn btn-primary"
        >
          <PlusCircle size={16} /> નવો સંકલ્પ પત્ર ભરો
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-card">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-9">
            <label className="filter-label">નાગરિક અથવા સરનામું શોધો</label>
            <div className="input-with-icon">
              <Search size={16} className="input-icon" />
              <input
                type="text"
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="નાગરિકનું નામ, મોબાઈલ અથવા સરનામું લખો..."
                className="form-input"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label className="filter-label">વોર્ડ નં. (Ward No)</label>
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

      {/* Table */}
      <div className="table-card">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>નાગરિકનું નામ</th>
                <th>સરનામું</th>
                <th>વોર્ડ નં.</th>
                <th>મોબાઇલ નંબર</th>
                <th>તારીખ</th>
                <th className="text-right">PDF</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-500">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2 text-emerald-600" />
                    લોડ થઈ રહ્યું છે...
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
                    </td>
                    <td>
                      <span className="text-xs text-slate-700 max-w-xs block truncate" title={item.address}>
                        {item.address}
                      </span>
                    </td>
                    <td>
                      <span className="inline-block font-bold text-slate-800 text-xs px-2 py-0.5 bg-slate-100 rounded">
                        વોર્ડ {item.ward_no}
                      </span>
                    </td>
                    <td className="text-xs font-mono text-slate-700">
                      📞 {item.mobile_no}
                    </td>
                    <td className="text-xs text-slate-500 font-medium">
                      {item.submission_date}
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => onPreviewPdf(item)}
                        className="btn-action-primary"
                        title="PDF પ્રિવ્યૂ અને ડાઉનલોડ"
                      >
                        <Eye size={14} /> PDF જુઓ
                      </button>
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
