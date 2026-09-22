import React, { useState, useEffect } from 'react';
import {
  Users, User, UserPlus, Search, Filter, Mail, Phone, Building2,
  Landmark, CheckCircle, KeyRound, Copy, Check, X, ShieldAlert,
  Loader2, AlertCircle, ArrowRight, MapPin
} from 'lucide-react';
import Pagination from '../components/Pagination';
import { officerService } from '../services/officerService';

// Popular Gujarat municipalities for fast selection
const MAHANAGARPALIKAS = [
  'અમદાવાદ મહાનગરપાલિકા (AMC)',
  'સુરત મહાનગરપાલિકા (SMC)',
  'વડોદરા મહાનગરપાલિકા (VMC)',
  'રાજકોટ મહાનગરપાલિકા (RMC)',
  'ભાવનગર મહાનગરપાલિકા (BMC)',
  'જામનગર મહાનગરપાલિકા (JMC)',
  'જુનાગઢ મહાનગરપાલિકા (JMC)',
  'ગાંધીનગર મહાનગરપાલિકા (GMC)'
];

const NAGARPALIKAS = [
  'મોરબી નગરપાલિકા',
  'આણંદ નગરપાલિકા',
  'નવસારી નગરપાલિકા',
  'સુરેન્દ્રનગર નગરપાલિકા',
  'ભરૂચ નગરપાલિકા',
  'પોરબંદર નગરપાલિકા',
  'મહેસાણા નગરપાલિકા',
  'ગોધરા નગરપાલિકા',
  'પાટણ નગરપાલિકા',
  'પાલનપુર નગરપાલિકા'
];

export default function AdminOfficers({ initialOpenCreate = false, onLoginAsOfficer }) {
  const [officers, setOfficers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(6);
  const [search, setSearch] = useState('');
  const [municipalityType, setMunicipalityType] = useState('All');
  const [loading, setLoading] = useState(false);

  // Create Officer Modal State
  const [showCreateModal, setShowCreateModal] = useState(initialOpenCreate);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formMuniType, setFormMuniType] = useState('મહાનગરપાલિકા');
  const [formMuniName, setFormMuniName] = useState(MAHANAGARPALIKAS[0]);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Success Created Notification State
  const [createdResult, setCreatedResult] = useState(null);
  const [copiedPass, setCopiedPass] = useState(false);

  const fetchOfficers = async () => {
    setLoading(true);
    try {
      const res = await officerService.getOfficers({
        search,
        municipalityType: municipalityType === 'All' ? '' : municipalityType,
        page,
        pageSize
      });
      setOfficers(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficers();
  }, [search, municipalityType, page]);

  const handleMuniTypeChange = (type) => {
    setFormMuniType(type);
    if (type === 'મહાનગરપાલિકા') {
      setFormMuniName(MAHANAGARPALIKAS[0]);
    } else {
      setFormMuniName(NAGARPALIKAS[0]);
    }
  };

  const handleCreateOfficer = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formName.trim()) {
      setFormError('કૃપા કરીને અધિકારીનું નામ દાખલ કરો.');
      return;
    }
    if (!formEmail.trim() || !formEmail.includes('@')) {
      setFormError('કૃપા કરીને માન્ય ઇમેઇલ એડ્રેસ દાખલ કરો.');
      return;
    }
    if (!formMobile.trim() || formMobile.trim().length < 10) {
      setFormError('કૃપા કરીને 10 અંકનો માન્ય મોબાઇલ નંબર દાખલ કરો.');
      return;
    }

    try {
      setFormLoading(true);
      const res = await officerService.createOfficer({
        name: formName,
        email: formEmail,
        mobile: formMobile,
        municipality_type: formMuniType,
        municipality_name: formMuniName
      });

      setCreatedResult(res);
      setShowCreateModal(false);
      // Reset inputs
      setFormName('');
      setFormEmail('');
      setFormMobile('');
      fetchOfficers();
    } catch (err) {
      setFormError(err.message || 'અધિકારી ઉમેરવામાં ભૂલ આવી.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCopyPassword = () => {
    if (!createdResult?.generatedPassword) return;
    navigator.clipboard.writeText(createdResult.generatedPassword);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2000);
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">અધિકારી સંચાલન (Officer Management)</h1>
          <p className="page-subtitle">
            સ્વચ્છતા સર્વેક્ષણ માટે ફિલ્ડ ઓફિસરોની યાદી, સર્ચ, ફિલ્ટર અને નવી નિમણૂક
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowCreateModal(true);
            setFormError('');
          }}
          className="btn btn-primary"
        >
          <UserPlus size={16} /> નવા અધિકારી ઉમેરો (Add Officer)
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-card">
        <div className="filter-grid-officers">
          {/* Search */}
          <div>
            <label className="filter-label">અધિકારી શોધો (Search by Name, Email, Mobile)</label>
            <div className="input-with-icon">
              <Search size={16} className="input-icon" />
              <input
                type="text"
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="નામ, ઈમેલ, મોબાઇલ અથવા પાલિકાનું નામ લખો..."
                className="form-input"
              />
            </div>
          </div>

          {/* Municipality Type Filter */}
          <div>
            <label className="filter-label">પાલિકાનો પ્રકાર (Municipality Type)</label>
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
                <option value="મહાનગરપાલિકા">મહાનગરપાલિકા (Municipal Corporation)</option>
                <option value="નગરપાલિકા">નગરપાલિકા (Municipality)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Officers Table */}
      <div className="table-card">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>અધિકારીનું નામ (Officer Name)</th>
                <th>સંપર્ક વિગતો (Email & Phone)</th>
                <th>પાલિકા પ્રકાર</th>
                <th>નિમણૂક પાલિકા (Municipality)</th>

                <th>નોંધણી તારીખ</th>
                {/* <th className="text-right">એક્શન</th> */}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-500">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2 text-emerald-600" />
                    અધિકારીઓ લોડ થઈ રહ્યા છે...
                  </td>
                </tr>
              ) : officers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-400">
                    શોધ માપદંડ સાથે મેળ ખાતા કોઈ અધિકારી મળ્યા નથી.
                  </td>
                </tr>
              ) : (
                officers.map(off => (
                  <tr key={off.id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                  
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{off.name}</p>
                         
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-xs font-medium text-slate-800 flex items-center gap-1">
                        <Mail size={12} className="text-slate-400" /> {off.email}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone size={12} className="text-slate-400" /> {off.mobile}
                      </div>
                    </td>
                    <td>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        off.municipality_type === 'મહાનગરપાલિકા' || off.municipality_type === 'Mahanagarpalika'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {off.municipality_type}
                      </span>
                    </td>
                    <td className="text-xs text-slate-800 font-semibold">
                      {off.municipality_name}
                    </td>
                  
                    <td className="text-xs text-slate-500 font-mono">
                      {new Date(off.created_at).toLocaleDateString('en-GB')}
                    </td>
                    {/* <td className="text-right">
                      {onLoginAsOfficer && (
                        <button
                          type="button"
                          onClick={() => onLoginAsOfficer(off.email, off.password_hash || 'Officer@123')}
                          className="btn-action-primary text-xs"
                          title="આ અધિકારી તરીકે લૉગ ઇન કરો"
                        >
                          લૉગ ઇન <ArrowRight size={12} />
                        </button>
                      )}
                    </td> */}
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

      {/* Create New Officer Modal */}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="modal-container max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="modal-header pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-200">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3 className="modal-title text-sm sm:text-base font-extrabold text-slate-900">નવા અધિકારી ઉમેરો</h3>
                  <p className="text-[11px] text-slate-500">ઓટો-જનરેટેડ પાસવર્ડ ઈમેલ દ્વારા મોકલાશે</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="modal-close-btn"
                title="બંધ કરો"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOfficer}>
              <div className="modal-body space-y-4 py-4">
                {formError && (
                  <div className="alert-error text-xs flex items-center gap-2 p-2.5 rounded-lg">
                    <AlertCircle size={15} className="flex-shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Section 1: Officer Info */}
                <div className="space-y-3">
                  <div className="modal-section-divider">
                    <User size={13} className="text-emerald-700" />
                    <span>અધિકારીની માહિતી (Officer Details)</span>
                  </div>

                  {/* Name & Mobile in 2 columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-7 modal-field mb-2">
                      <label className="modal-label">પૂરું નામ (Full Name) *</label>
                      <div className="modal-input-wrap">
                        <User size={14} className="modal-input-icon" />
                        <input
                          type="text"
                          value={formName}
                          onChange={e => setFormName(e.target.value)}
                          placeholder="દા.ત. રમેશ પટેલ"
                          className="modal-input"
                          required
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-5 modal-field">
                      <label className="modal-label">મોબાઇલ નં. *</label>
                      <div className="modal-input-wrap">
                        <Phone size={14} className="modal-input-icon" />
                        <input
                          type="tel"
                          value={formMobile}
                          onChange={e => setFormMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="98XXXXXXXX"
                          className="modal-input font-mono"
                          maxLength={10}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="modal-field">
                    <label className="modal-label">ઇમેઇલ સરનામું (Email Address) *</label>
                    <div className="modal-input-wrap">
                      <Mail size={14} className="modal-input-icon" />
                      <input
                        type="email"
                        value={formEmail}
                        onChange={e => setFormEmail(e.target.value)}
                        placeholder="officer.name@gujarat.gov.in"
                        className="modal-input"
                        required
                      />
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-500">
                      <KeyRound size={12} className="text-amber-600 flex-shrink-0" />
                      <span>આ ઇમેઇલ પર લૉગિન પાસવર્ડ મોકલવામાં આવશે.</span>
                    </div>
                  </div>
                </div>

                {/* Section 2: Municipality Assignment */}
                <div className="space-y-3 pt-1">
                  <div className="modal-section-divider">
                    <Building2 size={13} className="text-emerald-700" />
                    <span>પાલિકા ફાળવણી (Municipality Assignment)</span>
                  </div>

                  {/* Municipality Type Pill Selector */}
                  <div className="modal-field">
                    <label className="modal-label">પાલિકાનો પ્રકાર *</label>
                    <div className="modal-pill-tabs">
                      <button
                        type="button"
                        onClick={() => handleMuniTypeChange('મહાનગરપાલિકા')}
                        className={`modal-pill-tab ${formMuniType === 'મહાનગરપાલિકા' ? 'active' : ''}`}
                      >
                        <Landmark size={14} className={formMuniType === 'મહાનગરપાલિકા' ? 'text-emerald-700' : 'text-slate-400'} />
                        <span>મહાનગરપાલિકા</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMuniTypeChange('નગરપાલિકા')}
                        className={`modal-pill-tab ${formMuniType === 'નગરપાલિકા' ? 'active' : ''}`}
                      >
                        <Building2 size={14} className={formMuniType === 'નગરપાલિકા' ? 'text-emerald-700' : 'text-slate-400'} />
                        <span>નગરપાલિકા</span>
                      </button>
                    </div>
                  </div>

                  {/* Specific Municipality Name */}
                  <div className="modal-field">
                    <label className="modal-label">પાલિકાનું નામ *</label>
                    <div className="modal-input-wrap">
                      <MapPin size={14} className="modal-input-icon" />
                      <select
                        value={formMuniName}
                        onChange={e => setFormMuniName(e.target.value)}
                        className="modal-input"
                      >
                        {(formMuniType === 'મહાનગરપાલિકા' ? MAHANAGARPALIKAS : NAGARPALIKAS).map(name => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                        <option value="custom">અન્ય (કસ્ટમ નામ દાખલ કરો)...</option>
                      </select>
                    </div>

                    {formMuniName === 'custom' && (
                      <input
                        type="text"
                        placeholder="પાલિકાનું ચોક્કસ નામ લખો (દા.ત. અંજાર નગરપાલિકા)"
                        onChange={e => setFormMuniName(e.target.value)}
                        className="modal-input mt-2"
                        required
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-footer pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary text-xs sm:text-sm py-2 px-3.5"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="btn btn-primary text-xs sm:text-sm py-2 px-4 font-bold shadow-md flex items-center gap-1.5"
                >
                  {formLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> ઉમેરી રહ્યું છે...
                    </>
                  ) : (
                    <>
                      <UserPlus size={15} /> અધિકારી ઉમેરો
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Officer Created Success Popup with Generated Password */}
      {createdResult && (
        <div className="modal-backdrop">
          <div className="modal-container max-w-sm">
            <div className="modal-header bg-emerald-50/70 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <Check size={16} />
                </div>
                <div>
                  <h3 className="modal-title text-emerald-900">અધિકારી ઉમેરાયા!</h3>
                  <p className="text-[11px] text-emerald-700">ઓટો પાસવર્ડ જનરેટ કરાયો છે</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCreatedResult(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-body space-y-3.5">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">નામ:</span>
                  <strong className="text-slate-800">{createdResult.officer.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ઇમેઇલ:</span>
                  <strong className="text-slate-800">{createdResult.officer.email}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">પાલિકા:</span>
                  <strong className="text-slate-800">{createdResult.officer.municipality_name}</strong>
                </div>
              </div>

              {/* Password Box */}
              <div className="bg-amber-50/80 border border-amber-300/80 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">
                    જનરેટેડ પાસવર્ડ:
                  </span>
                  <div className="font-mono text-base font-black text-amber-950 mt-0.5">
                    {createdResult.generatedPassword}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  className="btn btn-secondary text-xs py-1 px-2.5 border-amber-300"
                >
                  {copiedPass ? (
                    <>
                      <Check size={13} className="text-emerald-600" /> કૉપિ!
                    </>
                  ) : (
                    <>
                      <Copy size={13} /> કૉપિ
                    </>
                  )}
                </button>
              </div>

              <p className="text-[10.5px] text-slate-400 leading-normal">
                * આ પાસવર્ડ સિસ્ટમ ઇનબૉક્સમાં મોકલાયો છે. અધિકારી લૉગ ઇન કરી પાસવર્ડ બદલી શકે છે.
              </p>
            </div>

            <div className="modal-footer flex-col sm:flex-row gap-1.5">
             
              <button
                type="button"
                onClick={() => setCreatedResult(null)}
                className="btn btn-secondary text-xs w-full sm:w-auto py-1.5 px-3"
              >
                પૂર્ણ (Done)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
