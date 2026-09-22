import React, { useState } from 'react';
import { X, Download, Check, Loader2, FileText } from 'lucide-react';
import SankalpPatraDocument from './SankalpPatraDocument';
import { pdfService } from '../services/pdfService';

export default function PdfPreviewModal({ isOpen, onClose, formData }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [viewMode, setViewMode] = useState('template'); // 'template' or 'vector'

  if (!isOpen || !formData) return null;

  const docId = 'sankalp-preview-target';

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      const citizenName = formData.citizen_name ? formData.citizen_name.replace(/[^a-zA-Z0-9_\u0A80-\u0AFF]/g, '_') : 'Citizen';
      const filename = `Sankalp_Patra_${citizenName}_Ward_${formData.ward_no || 'ward'}.pdf`;
      await pdfService.downloadPdfFromElement(docId, filename);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('PDF ડાઉનલોડ કરવામાં સમસ્યા આવી. કૃપા કરીને ફરી પ્રયાસ કરો.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container pdf-modal-width"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-200">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="modal-title">સ્વચ્છતા સંકલ્પ પત્ર - પ્રિવ્યૂ</h3>
              <p className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5 mt-0.5">
                <span className="font-semibold text-slate-700">{formData.citizen_name}</span>
                <span>•</span>
                <span>વોર્ડ નં. {formData.ward_no}</span>
                <span>•</span>
                <span>{formData.municipality_name}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('template')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  viewMode === 'template'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                અધિકૃત PDF
              </button>
              <button
                type="button"
                onClick={() => setViewMode('vector')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  viewMode === 'vector'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                વેક્ટર પ્રિન્ટ
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="modal-close-btn"
              title="બંધ કરો"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body - PDF Document Display */}
        <div className="modal-body pdf-preview-body">
          <div className="pdf-sheet-wrapper">
            <SankalpPatraDocument id={docId} data={formData} mode={viewMode} />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer justify-between">
          <div className="text-xs text-slate-500 hidden sm:block">
            {viewMode === 'template' ? '📄 ૧૬-૦૯-૨૦૨૬ અધિકૃત સરકારી ટેમ્પલેટ' : '🎨 હાઇ-ડેફિનેશન વેક્ટર પ્રિન્ટ ફોર્મેટ'}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isGenerating}
              className="btn btn-primary text-xs sm:text-sm py-2 px-5 shadow-md flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> ડાઉનલોડ થઈ રહ્યું છે...
                </>
              ) : downloadSuccess ? (
                <>
                  <Check size={15} /> ડાઉનલોડ સફળ!
                </>
              ) : (
                <>
                  <Download size={15} /> PDF ડાઉનલોડ કરો
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
