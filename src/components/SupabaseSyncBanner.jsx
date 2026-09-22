import React, { useState, useEffect } from 'react';
import { Database, AlertTriangle, CheckCircle2, Copy, Check, ExternalLink, RefreshCw } from 'lucide-react';
import { supabase, SUPABASE_URL } from '../supabaseClient';
import { SUPABASE_SQL_SCHEMA } from '../services/dbSchema';

export default function SupabaseSyncBanner({ onOpenSqlModal }) {
  const [status, setStatus] = useState('checking'); // 'connected', 'missing_tables', 'checking'
  const [copied, setCopied] = useState(false);

  const checkConnection = async () => {
    setStatus('checking');
    try {
      const res = await supabase.from('officers').select('id').limit(1);
      if (res.error && (res.error.code === 'PGRST205' || res.error.message?.includes('Could not find the table'))) {
        setStatus('missing_tables');
      } else if (!res.error) {
        setStatus('connected');
      } else {
        setStatus('missing_tables');
      }
    } catch {
      setStatus('missing_tables');
    }
  };

  useEffect(() => {
    checkConnection();
    const handleMissing = () => setStatus('missing_tables');
    window.addEventListener('swachhata_supabase_table_missing', handleMissing);
    return () => {
      window.removeEventListener('swachhata_supabase_table_missing', handleMissing);
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (status === 'connected') {
    return (
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl px-4 py-2.5 mb-4 text-xs flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold">સુપાબેસ ડેટાબેઝ સક્રિય છે (Supabase Cloud Connected):</span>
          <span className="font-mono text-[11px] text-emerald-700 truncate max-w-xs">{SUPABASE_URL}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-emerald-800">સંકલ્પ પત્રો અને ઓફિસરો સીધા સુપાબેસમાં સંગ્રહિત થાય છે</span>
          <button
            type="button"
            onClick={checkConnection}
            className="p-1 hover:bg-emerald-100 rounded text-emerald-700"
            title="કનેક્શન ચકાસો"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>
    );
  }

  if (status === 'missing_tables') {
    return (
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 text-amber-950 rounded-xl p-3.5 mb-5 shadow-sm text-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-200 text-amber-900 mt-0.5 sm:mt-0">
              <Database size={18} />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-amber-950">
                ⚠️ Supabase માં ટેબલ્સ સેટઅપ કરવા જરૂરી છે (One-Time Setup)
              </h4>
              <p className="text-amber-800 mt-0.5 leading-relaxed">
                તમારા Supabase પ્રોજેક્ટ (<code>{SUPABASE_URL}</code>) માં <code>officers</code> અને <code>sankalp_patras</code> ટેબલ બનાવવા નીચેનું SQL કૉપિ કરી Supabase SQL Editor માં ચલાવો.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleCopy}
              className="btn btn-secondary text-xs py-1.5 px-3 bg-white border-amber-300 hover:bg-amber-100/50 shadow-xs"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-600" /> કૉપિ થઈ ગયું!
                </>
              ) : (
                <>
                  <Copy size={14} /> SQL સ્ક્રિપ્ટ કૉપિ કરો
                </>
              )}
            </button>

            <a
              href="https://supabase.com/dashboard/project/wajbheemcbbkcklxjvxi/sql"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary text-xs py-1.5 px-3 bg-amber-600 hover:bg-amber-700 shadow-xs flex items-center gap-1"
            >
              Supabase SQL Editor ખોલો <ExternalLink size={13} />
            </a>

            <button
              type="button"
              onClick={checkConnection}
              className="p-1.5 hover:bg-amber-200 rounded-lg text-amber-800 transition"
              title="ટેબલ ચકાસો"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
