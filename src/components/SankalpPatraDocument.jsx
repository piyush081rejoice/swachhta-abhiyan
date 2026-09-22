import React from 'react';
import { CheckCircle2, Award, Sparkles, Building2, Calendar, Phone, MapPin, User } from 'lucide-react';

export default function SankalpPatraDocument({ data, id = 'sankalp-patra-doc', mode = 'vector' }) {
  if (!data) return null;

  const citizenName = data.citizen_name || '—';
  const address = data.address || '—';
  const wardNo = data.ward_no || '—';
  const mobileNo = data.mobile_no || '—';
  const officerName = data.officer_name || '—';
  const municipality = data.municipality_name || data.municipality_type || '—';
  const date = data.submission_date || new Date().toLocaleDateString('en-GB');
  const signature = data.signature_data;

  if (mode === 'template') {
    // Exact official PDF template overlay matching the provided image
    return (
      <div id={id} className="sankalp-doc-template-container">
        <img
          src="/assets/sankalp_patra_template.png"
          alt="Swachhata Sankalp Patra Template"
          className="sankalp-doc-bg"
          crossOrigin="anonymous"
        />

        {/* Dynamic Overlays positioned in exact fillable spaces */}
        {/* 1. Citizen Name */}
        <div className="overlay-field field-name">
          <span className="field-value">{citizenName}</span>
        </div>

        {/* 2. Address */}
        <div className="overlay-field field-address">
          <span className="field-value">{address}</span>
        </div>

        {/* 3. Ward No */}
        <div className="overlay-field field-ward">
          <span className="field-value">{wardNo}</span>
        </div>

        {/* 4. Mobile No */}
        <div className="overlay-field field-mobile">
          <span className="field-value">{mobileNo}</span>
        </div>

        {/* 5. Citizen Signature */}
        <div className="overlay-field field-signature">
          {signature ? (
            <img
              src={signature}
              alt="નાગરિકની સહી"
              className="signature-stamp-img"
              crossOrigin="anonymous"
            />
          ) : (
            <span className="unsigned-stamp">સહી નથી</span>
          )}
        </div>

        {/* 6. Officer Name (ઘર મુલાકાત લેનારનું નામ) */}
        <div className="overlay-field field-officer">
          <span className="field-value font-semibold">{officerName}</span>
        </div>

        {/* 7. Date (તારીખ) */}
        <div className="overlay-field field-date">
          <span className="field-value">{date}</span>
        </div>

        {/* 8. Municipality (મહાનગરપાલિકા / નગરપાલિકા) */}
        <div className="overlay-field field-muni">
          <span className="field-value font-semibold">{municipality}</span>
        </div>
      </div>
    );
  }

  // Vector High-Contrast Print Mode
  return (
    <div id={id} className="sankalp-doc-vector-page">
      {/* Top Banner Artwork */}
      <div className="vector-header-banner">
        <div className="flex justify-between items-center px-4 py-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🦁</span>
            <div>
              <h2 className="text-2xl font-black text-amber-950 tracking-wide">મારૂ શહેર મારૂ ગૌરવ</h2>
              <p className="text-xs font-semibold text-emerald-900">સ્વચ્છ ભારત મિશન - ગુજરાત</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <span className="text-2xl">👓</span>
              <p className="text-[10px] font-bold text-slate-800">સ્વચ્છ ભારત</p>
            </div>
            <div className="text-center">
              <span className="text-2xl">🏛️</span>
              <p className="text-[10px] font-bold text-slate-800">ગુજરાત સરકાર</p>
            </div>
          </div>
        </div>

        {/* Dustbins banner */}
        <div className="dustbins-row">
          <span className="bin-badge bg-emerald-600">🌱 લીલો કચરો (ભીનો)</span>
          <span className="bin-badge bg-blue-600">📦 સૂકો કચરો</span>
          <span className="bin-badge bg-rose-600">🩹 સેનેટરી કચરો</span>
          <span className="bin-badge bg-slate-800">🔋 ઇ-કચરો</span>
        </div>
      </div>

      {/* Title */}
      <div className="text-center my-4">
        <h1 className="text-3xl font-extrabold text-orange-600 tracking-wider">સ્વચ્છતા સંકલ્પ</h1>
        <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mt-1 rounded-full"></div>
      </div>

      {/* Citizen Details section */}
      <div className="vector-details-box">
        <div className="detail-line">
          <span className="detail-label">હું,</span>
          <span className="detail-fill font-bold text-slate-900">{citizenName}</span>
        </div>

        <div className="detail-line">
          <span className="detail-label">સરનામું:</span>
          <span className="detail-fill text-slate-800">{address}</span>
        </div>

        <div className="detail-line-split">
          <div className="flex-1 flex items-baseline gap-2">
            <span className="detail-label">વોર્ડ નં.:</span>
            <span className="detail-fill font-semibold text-slate-900">{wardNo}</span>
          </div>
          <div className="flex-1 flex items-baseline gap-2">
            <span className="detail-label">મોબાઇલ નં.:</span>
            <span className="detail-fill font-semibold text-slate-900">{mobileNo}</span>
          </div>
        </div>
      </div>

      {/* Section Subheader */}
      <div className="my-3 text-center">
        <p className="text-sm font-bold text-amber-900 leading-snug">
          મારા ઘર, આસપાસના વિસ્તાર અને શહેરને સ્વચ્છ, સુંદર અને સ્વસ્થ રાખવા માટે નીચેના સંકલ્પો કરું છું:
        </p>
      </div>

      {/* 6 Pledges */}
      <div className="pledge-list">
        <div className="pledge-item">
          <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
          <span>હું મારા ઘરમાંથી નીકળતા કચરાને છુટો પાડીને આપીશ.</span>
        </div>
        <div className="pledge-item">
          <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
          <span>હું કચરો મહાનગરપાલિકા / નગરપાલિકાના અધિકૃત વાહનમાં જ આપીશ અને જાહેર સ્થળે કચરો ફેંકીશ નહીં.</span>
        </div>
        <div className="pledge-item">
          <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
          <span>હું સિંગલ-યુઝ પ્લાસ્ટિકનો ઉપયોગ ઘટાડવા પ્રયત્ન કરીશ અને શક્ય હોય ત્યાં પુન:ઉપયોગી વસ્તુઓનો ઉપયોગ કરીશ.</span>
        </div>
        <div className="pledge-item">
          <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
          <span>હું ઘર તથા આસપાસ સ્વચ્છતા રાખીશ અને અન્ય લોકોને પણ સ્વચ્છતા માટે પ્રેરિત કરીશ.</span>
        </div>
        <div className="pledge-item">
          <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
          <span>હું સફાઈ મિત્રોના કાર્યનું સન્માન કરીશ અને તેમને જરૂરી સહયોગ આપીશ.</span>
        </div>
        <div className="pledge-item">
          <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
          <span>હું મારા શહેરને સ્વચ્છ રાખવામાં જવાબદાર નાગરિક તરીકે સક્રિય ભાગીદાર બનીશ.</span>
        </div>
      </div>

      {/* Highlight Box: મારો સંકલ્પ */}
      <div className="highlight-sankalp-box">
        <h4 className="font-extrabold text-amber-900 text-center mb-1 text-base">મારો સંકલ્પ</h4>
        <p className="text-center font-bold text-amber-950 text-xs italic leading-relaxed">
          "સ્વચ્છતા માત્ર સરકારની જવાબદારી નથી, તે મારી પણ જવાબદારી છે. હું સ્વચ્છતા જાળવીશ, કચરો અલગ કરીશ અને સ્વચ્છ શહેરના નિર્માણમાં મારો સહયોગ આપીશ."
        </p>
      </div>

      {/* Bottom Signatures and Verification */}
      <div className="bottom-verification-grid">
        <div className="verification-col">
          <div className="sig-area-label">નાગરિકની સહી:</div>
          <div className="sig-stamp-box">
            {signature ? (
              <img src={signature} alt="Sign" className="h-12 object-contain" crossOrigin="anonymous" />
            ) : (
              <span className="text-slate-400 text-xs">—</span>
            )}
          </div>
        </div>

        <div className="verification-col">
          <div className="sig-area-label">ઘર મુલાકાત લેનારનું નામ:</div>
          <div className="officer-field-value">{officerName}</div>
        </div>

        <div className="verification-col">
          <div className="sig-area-label">તારીખ:</div>
          <div className="officer-field-value">{date}</div>
        </div>

        <div className="verification-col">
          <div className="sig-area-label">મહાનગરપાલિકા / નગરપાલિકા:</div>
          <div className="officer-field-value font-bold text-emerald-800">{municipality}</div>
        </div>
      </div>

      {/* Decorative footer */}
      <div className="vector-footer-strip">
        <span>🌿 સ્વચ્છ શહેર - આપણું ગૌરવ 🌿</span>
      </div>
    </div>
  );
}
