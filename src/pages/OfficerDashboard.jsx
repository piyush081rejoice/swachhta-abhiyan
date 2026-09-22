import React, { useState, useEffect } from 'react';
import {
  FileText, PlusCircle, CheckCircle, Calendar,
  Building2, Landmark, Eye, RefreshCw, ArrowUpRight
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { sankalpService } from '../services/sankalpService';

export default function OfficerDashboard({ user, onNavigate, onPreviewPdf }) {
  const [stats, setStats] = useState({
    totalForms: 0,
    todayForms: 0
  });
  const [recentForms, setRecentForms] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [formStats, formsRes] = await Promise.all([
        sankalpService.getStats(user.id),
        sankalpService.getForms({ officerId: user.id, page: 1, pageSize: 5 })
      ]);
      setStats(formStats);
      setRecentForms(formsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    let debounceTimer;
    const handleUpdate = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        loadData();
      }, 300);
    };

    window.addEventListener('swachhata_forms_updated', handleUpdate);
    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener('swachhata_forms_updated', handleUpdate);
    };
  }, [user]);

  const isMahanagar = user?.municipality_type?.includes('મહાનગર') || user?.municipality_type?.includes('Mahanagar');

  return (
    <div className="page-wrapper">
      {/* Officer Welcome Header */}
      <div className="officer-hero-banner">
        <div className="flex flex-row sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="avatar-circle-lg">
              {user?.name ? user.name[0] : 'O'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  નમસ્તે, {user?.name}
                </h1>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isMahanagar ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isMahanagar ? <Landmark size={12} /> : <Building2 size={12} />}
                  {user?.municipality_type || 'નગરપાલિકા'}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                🏛️ {user?.municipality_name} • ફિલ્ડ ઇન્સ્પેક્શન અને સંકલ્પ પોર્ટલ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadData}
              className="btn btn-secondary text-xs"
              title="રિફ્રેશ"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('new-form')}
              className="btn btn-primary text-xs shadow-md shadow-emerald-700/20"
            >
              <PlusCircle size={16} /> નવો સંકલ્પ પત્ર ભરો (Fill Form)
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="stat-cards-grid grid-cols-3-responsive">
        <StatCard
          title="મારા દ્વારા જમા થયેલા કુલ સંકલ્પ પત્રો"
          value={stats.totalForms}
          subtitle="ડોર-ટુ-ડોર નોંધણી"
          icon={FileText}
          colorClass="stat-emerald"
          onClick={() => onNavigate('forms')}
        />
        <StatCard
          title="આજના જમા થયેલા સંકલ્પ પત્રો"
          value={stats.todayForms}
          subtitle="આજની પ્રગતિ"
          icon={Calendar}
          colorClass="stat-amber"
          onClick={() => onNavigate('forms')}
        />
        <div className="stat-card stat-blue cursor-pointer" onClick={() => onNavigate('new-form')}>
          <div className="stat-card-inner">
            <div className="stat-content">
              <p className="stat-title">ઝડપી એન્ટ્રી</p>
              <h3 className="stat-value text-base font-bold text-blue-900 mt-1">
                નવી મુલાકાત શરૂ કરો
              </h3>
              <p className="stat-subtitle">ડિજિટલ સહી સાથે ત્વરિત PDF જનરેટ કરો</p>
            </div>
            <div className="stat-icon-wrapper">
              <PlusCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="table-card">
        <div className="table-card-header">
          <div>
            <h3 className="table-card-title">મારા તાજેતરના સંકલ્પ પત્રો (My Recent Forms)</h3>
            <p className="table-card-subtitle">
              તમે છેલ્લે જમા કરાવેલ નાગરિક સંકલ્પ પત્રોની યાદી
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('forms')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            બધા જુઓ <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>નાગરિકનું નામ</th>
                <th>વોર્ડ & સરનામું</th>
                <th>મોબાઇલ નંબર</th>
                <th>તારીખ</th>
                <th>સહી સ્થિતિ</th>
                <th className="text-right">PDF પ્રિવ્યૂ / ડાઉનલોડ</th>
              </tr>
            </thead>
            <tbody>
              {recentForms.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-400">
                    <p className="font-semibold text-slate-600 mb-1">તમે હજુ સુધી કોઈ સંકલ્પ પત્ર જમા કરાવ્યો નથી.</p>
                    <p className="text-xs text-slate-400 mb-4">ડોર-ટુ-ડોર સર્વે દરમિયાન નાગરિકની વિગતો અને ડિજિટલ સહી લઈને નવો ફોર્મ ભરો.</p>
                    <button
                      type="button"
                      onClick={() => onNavigate('new-form')}
                      className="btn btn-primary text-xs mx-auto"
                    >
                      <PlusCircle size={14} /> પ્રથમ સંકલ્પ પત્ર ભરો
                    </button>
                  </td>
                </tr>
              ) : (
                recentForms.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="font-bold text-slate-900 text-sm">
                        {item.citizen_name}
                      </div>
                    </td>
                    <td>
                      <span className="inline-block font-semibold text-slate-800 text-xs mr-2">
                        વોર્ડ નં.: {item.ward_no}
                      </span>
                      <span className="text-[11px] text-slate-500 truncate max-w-xs block">
                        {item.address}
                      </span>
                    </td>
                    <td className="text-xs font-mono text-slate-700">
                      📞 {item.mobile_no}
                    </td>
                    <td className="text-xs text-slate-500 font-medium">
                      {item.submission_date}
                    </td>
                    <td>
                      {item.signature_data ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                          <CheckCircle size={13} /> સહી થયેલ છે
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => onPreviewPdf(item)}
                        className="btn-action-primary"
                        title="PDF જુઓ અને ડાઉનલોડ કરો"
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
      </div>
    </div>
  );
}
