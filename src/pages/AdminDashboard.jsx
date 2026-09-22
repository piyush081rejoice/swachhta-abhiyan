import React, { useState, useEffect } from 'react';
import {
  Users, FileText, Building2, Landmark, PlusCircle,
  Eye, Download, ArrowUpRight, CheckCircle, RefreshCw, Phone
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { officerService } from '../services/officerService';
import { sankalpService } from '../services/sankalpService';

export default function AdminDashboard({ onNavigate, onPreviewPdf }) {
  const [officerCount, setOfficerCount] = useState(0);
  const [stats, setStats] = useState({
    totalForms: 0,
    todayForms: 0,
    nagarpalikaForms: 0,
    mahanagarpalikaForms: 0
  });
  const [recentForms, setRecentForms] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [count, formStats, formsRes] = await Promise.all([
        officerService.getOfficerCount(),
        sankalpService.getStats(),
        sankalpService.getForms({ page: 1, pageSize: 5 })
      ]);
      setOfficerCount(count);
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
    window.addEventListener('swachhata_officers_updated', handleUpdate);
    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener('swachhata_forms_updated', handleUpdate);
      window.removeEventListener('swachhata_officers_updated', handleUpdate);
    };
  }, []);

  return (
    <div className="page-wrapper">
      {/* Dashboard Title & Actions */}
      <div className="page-header">
        <div>
          <h1 className="page-title">વહીવટી ડેશબોર્ડ (Admin Dashboard)</h1>
          <p className="page-subtitle">
            સ્વચ્છ ભારત મિશન હેઠળ રાજ્યભરના અધિકારીઓ અને નાગરિક સંકલ્પ પત્રોની સ્થિતિ
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadData}
            className="btn btn-secondary text-xs"
            title="રિફ્રેશ કરો"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> રિફ્રેશ
          </button>
          <button
            type="button"
            onClick={() => onNavigate('officers', { openCreate: true })}
            className="btn btn-primary text-xs"
          >
            <PlusCircle size={15} /> નવા અધિકારી ઉમેરો
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="stat-cards-grid">
        <StatCard
          title="કુલ નોંધાયેલ અધિકારીઓ"
          value={officerCount}
          subtitle="મહાનગરપાલિકા અને નગરપાલિકા"
          icon={Users}
          colorClass="stat-emerald"
          onClick={() => onNavigate('officers')}
        />
        <StatCard
          title="કુલ ભરેલા સંકલ્પ પત્રો"
          value={stats.totalForms}
          subtitle={`આજના સંકલ્પ: ${stats.todayForms}`}
          icon={FileText}
          colorClass="stat-amber"
          onClick={() => onNavigate('forms')}
        />
        <StatCard
          title="મહાનગરપાલિકા સંકલ્પો"
          value={stats.mahanagarpalikaForms}
          subtitle="AMC, SMC, RMC, વગેરે"
          icon={Landmark}
          colorClass="stat-blue"
          onClick={() => onNavigate('forms', { municipalityType: 'મહાનગરપાલિકા' })}
        />
        <StatCard
          title="નગરપાલિકા સંકલ્પો"
          value={stats.nagarpalikaForms}
          subtitle="જિલ્લા કક્ષાની નગરપાલિકાઓ"
          icon={Building2}
          colorClass="stat-purple"
          onClick={() => onNavigate('forms', { municipalityType: 'નગરપાલિકા' })}
        />
      </div>

      {/* Quick Overview Summary Strip */}

      <div className="table-card">
        <div className="table-card-header">
          <div>
            <h3 className="table-card-title">તાજેતરમાં ભરાયેલા સંકલ્પ પત્રો (Recent Submissions)</h3>
            <p className="table-card-subtitle">
              રાજ્યભરમાંથી છેલ્લે જમા થયેલા સ્વચ્છતા સંકલ્પ પત્રો
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('forms')}
            className="btn btn-primary text-xs"
          >
            બધા જુઓ <ArrowUpRight size={14} />
          </button>
        </div>

      

        <div className="table-responsive-wrapper overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="whitespace-nowrap">નાગરિકનું નામ (Citizen)</th>
                <th className="whitespace-nowrap">મોબાઇલ નં.</th>
                <th className="whitespace-nowrap">વોર્ડ નં. / સરનામું</th>
                <th className="whitespace-nowrap">પાલિકા (Municipality)</th>
                <th className="whitespace-nowrap">મુલાકાત લેનાર અધિકારી</th>
                <th className="whitespace-nowrap">તારીખ</th>
                <th className="whitespace-nowrap text-right">PDF પ્રમાણપત્ર</th>
              </tr>
            </thead>
            <tbody>
              {recentForms.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-400">
                    હજુ સુધી કોઈ સંકલ્પ પત્ર જમા થયેલ નથી.
                  </td>
                </tr>
              ) : (
                recentForms.map(form => (
                  <tr key={form.id}>
                    <td className="whitespace-nowrap">
                      <div className="font-bold text-slate-900 text-sm">{form.citizen_name}</div>
                    </td>
                    <td className="whitespace-nowrap">
                      <div className="text-xs font-mono text-slate-600 flex items-center gap-1.5">
                        <Phone size={12} className="text-slate-400 flex-shrink-0" />
                        <span>{form.mobile_no}</span>
                      </div>
                    </td>
                    <td>
                      <div className="text-xs font-bold text-slate-800">વોર્ડ નં.: {form.ward_no}</div>
                      <div className="text-[11px] text-slate-500 max-w-[200px] truncate" title={form.address}>
                        {form.address}
                      </div>
                    </td>
                    <td className="whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${
                        form.municipality_type?.includes('મહાનગર') || form.municipality_type?.includes('Mahanagar')
                          ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      }`}>
                        {form.municipality_name}
                      </span>
                    </td>
                    <td className="whitespace-nowrap text-xs text-slate-700 font-medium">
                      {form.officer_name}
                    </td>
                    <td className="whitespace-nowrap text-xs text-slate-500 font-mono">
                      {form.submission_date}
                    </td>
                    <td className="whitespace-nowrap text-right">
                      <button
                        type="button"
                        onClick={() => onPreviewPdf(form)}
                        className="btn-action-primary text-xs px-2.5 py-1"
                        title="PDF પ્રિવ્યૂ અને ડાઉનલોડ"
                      >
                        <FileText size={13} /> PDF જુઓ
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
