import React, { useState } from 'react';
import {
  FileCheck, User, MapPin, Phone, Hash, PenTool, CheckCircle2,
  AlertCircle, Sparkles, Download, Eye, ArrowRight, RefreshCw, Loader2,
  ShieldCheck, Building2, Calendar, RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import SignaturePad from '../components/SignaturePad';
import { sankalpService } from '../services/sankalpService';

const SAMPLE_SIGNATURE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="120" viewBox="0 0 320 120"><path d="M 25 75 Q 60 15, 95 65 T 160 55 Q 200 20, 235 70 T 295 45" stroke="%23020617" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M 55 90 Q 165 75, 280 85" stroke="%23020617" stroke-width="3.5" fill="none" stroke-linecap="round"/></svg>';

export default function OfficerNewForm({ user, onNavigate, onPreviewPdf }) {
  const todayDate = new Date().toLocaleDateString('en-GB');

  const [citizenName, setCitizenName] = useState('');
  const [address, setAddress] = useState('');
  const [wardNo, setWardNo] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [signatureData, setSignatureData] = useState(null);
  const [sigKey, setSigKey] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [submittedData, setSubmittedData] = useState(null);

  const handleFillSample = () => {
    setCitizenName('કમલેશભાઈ બાબુભાઈ પ્રજાપતિ');
    setAddress('બી-૧૪, શિવશક્તિ સોસાયટી, રિંગ રોડ પાસે');
    setWardNo('૦૭');
    setMobileNo('9825012345');
    setSignatureData(SAMPLE_SIGNATURE);
    setSigKey(prev => prev + 1);
    setFormError('');
  };

  const handleClearForm = () => {
    setCitizenName('');
    setAddress('');
    setWardNo('');
    setMobileNo('');
    setSignatureData(null);
    setSigKey(prev => prev + 1);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!citizenName.trim()) {
      setFormError('કૃપા કરીને નાગરિકનું પૂરું નામ દાખલ કરો.');
      return;
    }
    if (!address.trim()) {
      setFormError('કૃપા કરીને નાગરિકનું સરનામું દાખલ કરો.');
      return;
    }
    if (!wardNo.trim()) {
      setFormError('કૃપા કરીને વોર્ડ નંબર દાખલ કરો.');
      return;
    }
    if (!mobileNo.trim() || mobileNo.trim().length < 10) {
      setFormError('કૃપા કરીને 10 અંકનો માન્ય મોબાઇલ નંબર દાખલ કરો.');
      return;
    }
    if (!signatureData) {
      setFormError('કૃપા કરીને નીચે આપેલા વ્હાઇટ બોક્સમાં નાગરિકની ડિજિટલ સહી કરાવો.');
      return;
    }

    try {
      setSubmitting(true);
      const newForm = await sankalpService.submitForm({
        citizen_name: citizenName,
        address,
        ward_no: wardNo,
        mobile_no: mobileNo,
        signature_data: signatureData,
        officer_id: user?.id || 'off_default',
        officer_name: user?.name || 'અધિકારી',
        municipality_type: user?.municipality_type || 'નગરપાલિકા',
        municipality_name: user?.municipality_name || 'નગરપાલિકા'
      });

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      setSubmittedData(newForm);
    } catch (err) {
      setFormError(err.message || 'સંકલ્પ પત્ર જમા કરવામાં ભૂલ આવી.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForAnother = () => {
    setCitizenName('');
    setAddress('');
    setWardNo('');
    setMobileNo('');
    setSignatureData(null);
    setSigKey(prev => prev + 1);
    setSubmittedData(null);
    setFormError('');
  };

  return (
    <div className="page-wrapper max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-200 shadow-xs">
            <FileCheck size={22} />
          </div>
          <div>
            <h1 className="page-title">નવો સ્વચ્છતા સંકલ્પ પત્ર</h1>
            <p className="page-subtitle">
              ડોર-ટુ-ડોર મુલાકાત દરમિયાન નાગરિકની વિગતો અને ડિજિટલ સહી મેળવી સંકલ્પ પત્ર ભરો
            </p>
          </div>
        </div>

        {!submittedData && (
          <button
            type="button"
            onClick={handleFillSample}
            className="btn btn-secondary text-xs flex items-center gap-1.5 shadow-xs"
            title="ટેસ્ટિંગ માટે નમૂનાની વિગતો ભરો"
          >
            <Sparkles size={14} className="text-amber-500" /> સેમ્પલ ડેટા ભરો (Fill Sample)
          </button>
        )}
      </div>

      {submittedData ? (
        /* Submission Success Card with Instant PDF Actions */
        <div className="success-submission-card">
          <div className="success-icon-wrapper">
            <CheckCircle2 size={48} className="text-emerald-600 animate-bounce" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 mt-2">
            સ્વચ્છતા સંકલ્પ પત્ર સફળતાપૂર્વક જમા થયો!
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
            નાગરિક <strong>{submittedData.citizen_name}</strong> નો સંકલ્પ પત્ર સેવ કરવામાં આવ્યો છે અને આપના ખાતા સાથે લિંક થયો છે.
          </p>

          <div className="submitted-summary-box">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div>
                <span className="label">નાગરિકનું નામ:</span>
                <p className="value">{submittedData.citizen_name}</p>
              </div>
              <div>
                <span className="label">વોર્ડ નં.:</span>
                <p className="value">{submittedData.ward_no}</p>
              </div>
              <div>
                <span className="label">મોબાઇલ નં.:</span>
                <p className="value">{submittedData.mobile_no}</p>
              </div>
              <div>
                <span className="label">મુલાકાત તારીખ:</span>
                <p className="value">{submittedData.submission_date}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button
              type="button"
              onClick={() => onPreviewPdf(submittedData)}
              className="btn btn-primary px-6 py-2.5 text-sm font-bold shadow-lg shadow-emerald-700/20 flex items-center gap-2"
            >
              <Eye size={17} /> સહી કરેલ PDF જુઓ અને ડાઉનલોડ કરો
            </button>

            <button
              type="button"
              onClick={handleResetForAnother}
              className="btn btn-secondary px-5 py-2.5 text-sm font-semibold flex items-center gap-2"
            >
              <RefreshCw size={16} /> નવો સંકલ્પ પત્ર ભરો (Fill Another)
            </button>

            <button
              type="button"
              onClick={() => onNavigate('forms')}
              className="btn btn-ghost px-4 py-2.5 text-sm text-slate-600 flex items-center gap-1.5"
            >
              મારા બધા ફોર્મ્સ જુઓ <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        /* Form */
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 space-y-6">
          {/* Form Auto-attached Officer Verification Bar */}
          <div className="officer-auto-strip">
            <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
              <div className="officer-chip-item">
                <ShieldCheck size={17} className="text-emerald-700 flex-shrink-0" />
                <div>
                  <span className="text-slate-500 text-xs">મુલાકાત લેનાર અધિકારી:</span>{' '}
                  <strong className="text-slate-900 font-bold">{user?.name}</strong>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="officer-chip-item">
                  <Building2 size={16} className="text-emerald-700 flex-shrink-0" />
                  <div>
                    <span className="text-slate-500 text-xs">પાલિકા:</span>{' '}
                    <strong className="text-emerald-800 font-bold">{user?.municipality_name}</strong>
                  </div>
                </div>

                <div className="officer-chip-item">
                  <Calendar size={16} className="text-emerald-700 flex-shrink-0" />
                  <div>
                    <span className="text-slate-500 text-xs">તારીખ:</span>{' '}
                    <strong className="text-slate-800 font-bold">{todayDate}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {formError && (
            <div className="alert-error flex items-center gap-2.5 text-xs p-3 rounded-xl">
              <AlertCircle size={17} className="flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* 1. Citizen Details Card */}
          <div className="form-section-card">
            <div className="form-section-header">
              <div className="form-section-header-left">
                <div className="form-section-icon-badge">
                  <User size={19} />
                </div>
                <div>
                  <h3 className="form-section-title-text">૧. નાગરિકની વિગતો (Citizen Details)</h3>
                  <p className="form-section-subtitle-text">
                    ડોર-ટુ-ડોર સર્વે હેઠળ નાગરિકની આધારભૂત ઓળખ અને સરનામું
                  </p>
                </div>
              </div>
              <span className="form-section-badge hidden sm:inline-flex">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                ફરજિયાત વિગતો
              </span>
            </div>

            <div className="citizen-form-grid">
              {/* Row 1, Col 1: Citizen Name */}
              <div className="col-7 form-field-group">
                <label className="form-field-label">
                  <span>
                    હું, (નાગરિકનું પૂરું નામ)<span className="label-req">*</span>
                  </span>
                  <span className="label-hint">Full Name</span>
                </label>
                <div className="modern-input-wrap">
                  <User size={17} className="modern-input-icon" />
                  <input
                    type="text"
                    value={citizenName}
                    onChange={e => setCitizenName(e.target.value)}
                    placeholder="દા.ત. રમેશભાઈ ગોવિંદભાઈ પટેલ"
                    className="modern-input"
                    required
                  />
                </div>
              </div>

              {/* Row 1, Col 2: Mobile No */}
              <div className="col-5 form-field-group">
                <label className="form-field-label">
                  <span>
                    મોબાઇલ નં.<span className="label-req">*</span>
                  </span>
                  <span className="label-hint">10-Digit Mobile</span>
                </label>
                <div className="modern-input-wrap">
                  <Phone size={17} className="modern-input-icon" />
                  <input
                    type="tel"
                    value={mobileNo}
                    onChange={e => setMobileNo(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="98XXXXXXXX"
                    className="modern-input font-mono"
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              {/* Row 2, Col 1: Address */}
              <div className="col-8 form-field-group">
                <label className="form-field-label">
                  <span>
                    રહેઠાણનું સરનામું (Address)<span className="label-req">*</span>
                  </span>
                  <span className="label-hint">મકાન / સોસાયટી / વિસ્તાર</span>
                </label>
                <div className="modern-input-wrap">
                  <MapPin size={17} className="modern-input-icon" />
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="ઘર/ફ્લેટ નં., સોસાયટીનું નામ, લેન્ડમાર્ક..."
                    className="modern-input"
                    required
                  />
                </div>
              </div>

              {/* Row 2, Col 2: Ward No */}
              <div className="col-4 form-field-group">
                <label className="form-field-label">
                  <span>
                    વોર્ડ નં. (Ward)<span className="label-req">*</span>
                  </span>
                  <span className="label-hint">દા.ત. ૦૭</span>
                </label>
                <div className="modern-input-wrap">
                  <Hash size={17} className="modern-input-icon" />
                  <input
                    type="text"
                    value={wardNo}
                    onChange={e => setWardNo(e.target.value)}
                    placeholder="દા.ત. ૦૭ અથવા 12"
                    className="modern-input font-mono"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. 6 Pledges Official Card */}
          <div className="pledge-read-card">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={17} className="text-amber-700" />
              <h4 className="font-extrabold text-amber-950 text-sm">
                સ્વચ્છતા સંકલ્પના મુખ્ય ૬ મુદ્દાઓ (Key Pledges)
              </h4>
            </div>
            <p className="text-xs text-amber-900 font-medium mb-3.5">
              મારા ઘર, આસપાસના વિસ્તાર અને શહેરને સ્વચ્છ, સુંદર અને સ્વસ્થ રાખવા માટે નીચેના સંકલ્પો કરું છું:
            </p>

            <div className="pledge-grid">
              <div className="pledge-card-item">
                <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>૧. ઘરમાંથી નીકળતા કચરાને છુટો પાડીને આપીશ.</span>
              </div>
              <div className="pledge-card-item">
                <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>૨. કચરો પાલિકાના અધિકૃત વાહનમાં જ આપીશ.</span>
              </div>
              <div className="pledge-card-item">
                <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>૩. સિંગલ-યુઝ પ્લાસ્ટિકનો ઉપયોગ ઘટાડીશ.</span>
              </div>
              <div className="pledge-card-item">
                <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>૪. અન્ય લોકોને સ્વચ્છતા માટે પ્રેરિત કરીશ.</span>
              </div>
              <div className="pledge-card-item">
                <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>૫. સફાઈ મિત્રોના કાર્યનું સન્માન કરીશ.</span>
              </div>
              <div className="pledge-card-item">
                <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>૬. જવાબદાર નાગરિક તરીકે સક્રિય ભાગીદાર બનીશ.</span>
              </div>
            </div>
          </div>

          {/* 3. Signature Canvas Pad Card */}
          <div className="form-section-card">
            <div className="form-section-header">
              <div className="form-section-header-left">
                <div className="form-section-icon-badge badge-blue">
                  <PenTool size={18} />
                </div>
                <div>
                  <h3 className="form-section-title-text">૨. નાગરિકની ડિજિટલ સહી (Citizen's Digital Signature)</h3>
                  <p className="form-section-subtitle-text">
                    નાગરિકની આંગળી અથવા ટચ પેન વડે નીચે આપેલા સફેદ બોક્સમાં સહી કરાવો
                  </p>
                </div>
              </div>
              <span className="form-section-badge hidden sm:inline-flex">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                સહી ફરજિયાત
              </span>
            </div>

            <div className="pt-1">
              <SignaturePad key={sigKey} onSave={setSignatureData} initialValue={signatureData} />
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleClearForm}
              className="btn btn-ghost text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1.5 w-full sm:w-auto justify-center"
            >
              <RotateCcw size={14} /> વિગતો સાફ કરો (Clear Form)
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="btn btn-secondary text-xs sm:text-sm py-2.5 px-4 flex-1 sm:flex-initial"
              >
                રદ કરો
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary px-6 sm:px-8 py-2.5 font-bold text-xs sm:text-sm shadow-md shadow-emerald-700/20 flex-1 sm:flex-initial flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> સંકલ્પ પત્ર જમા થઈ રહ્યો છે...
                  </>
                ) : (
                  <>
                    <FileCheck size={18} /> સંકલ્પ પત્ર સબમિટ કરો
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
