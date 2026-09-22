import React, { useState } from 'react';
import { X, Copy, Check, Database, ExternalLink } from 'lucide-react';
import { SUPABASE_SQL_SCHEMA } from '../services/dbSchema';
import { SUPABASE_URL } from '../supabaseClient';

export default function SqlModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container sql-modal-width">
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Database size={18} />
            </div>
            <div>
              <h3 className="modal-title">Supabase Database Schema</h3>
              <p className="text-[11px] text-slate-500 font-mono truncate max-w-[280px]">
                {SUPABASE_URL}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body space-y-2.5">
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-2.5 text-xs text-emerald-900 leading-relaxed">
            <strong>ℹ️ સૂચના:</strong> આ SQL સ્ક્રિપ્ટને કૉપિ કરી Supabase <strong>SQL Editor</strong> માં રન કરવાથી <code>officers</code> અને <code>sankalp_patras</code> ટેબલ બની જશે.
          </div>

          <div className="relative">
            <pre className="sql-code-block">{SUPABASE_SQL_SCHEMA}</pre>
            <button
              onClick={handleCopy}
              className="copy-sql-btn text-xs py-1 px-2"
              title="Copy SQL"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-400" /> કૉપિ થયું!
                </>
              ) : (
                <>
                  <Copy size={13} /> કૉપિ SQL
                </>
              )}
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <a
            href="https://supabase.com/dashboard/project/wajbheemcbbkcklxjvxi/sql"
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost text-xs text-emerald-700 flex items-center gap-1 py-1.5 px-2.5"
          >
            SQL Editor <ExternalLink size={12} />
          </a>
          <button onClick={onClose} className="btn btn-secondary text-xs py-1.5 px-3">
            બંધ કરો
          </button>
        </div>
      </div>
    </div>
  );
}
