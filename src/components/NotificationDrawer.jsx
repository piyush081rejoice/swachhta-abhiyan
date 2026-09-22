import React, { useState, useEffect } from 'react';
import { X, Mail, KeyRound, Check, Copy, Bell, Trash2, ArrowRight } from 'lucide-react';
import { notificationService } from '../services/notificationService';

export default function NotificationDrawer({ isOpen, onClose, onLoginAsOfficer }) {
  const [notifications, setNotifications] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  const refresh = () => {
    setNotifications(notificationService.getNotifications());
  };

  useEffect(() => {
    refresh();
    const handleUpdate = () => refresh();
    window.addEventListener('swachhata_new_notification', handleUpdate);
    window.addEventListener('swachhata_notifications_changed', handleUpdate);
    return () => {
      window.removeEventListener('swachhata_new_notification', handleUpdate);
      window.removeEventListener('swachhata_notifications_changed', handleUpdate);
    };
  }, []);

  if (!isOpen) return null;

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    notificationService.clearAll();
    refresh();
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={e => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Mail size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">સિસ્ટમ ઇમેઇલ ઇનબૉક્સ</h3>
              <p className="text-xs text-slate-500">System Generated Password & Email Alerts</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition text-xs"
                title="બધું સાફ કરો"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="drawer-body">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Mail size={40} className="mx-auto mb-3 opacity-40 text-slate-300" />
              <p className="font-semibold text-sm">કોઈ નવો ઇમેઇલ નથી</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                જ્યારે એડમિન દ્વારા નવા અધિકારી બનાવવામાં આવશે અથવા પાસવર્ડ રીસેટ થશે ત્યારે સિસ્ટમ ઇમેઇલ અહીં જોવા મળશે.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => (
                <div key={n.id} className="email-card">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                      <KeyRound size={14} className="text-emerald-600" />
                      <span>{n.title}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-slate-600 space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">To:</span>
                      <span className="font-medium text-slate-800">{n.recipient}</span>
                    </div>

                    {n.temporaryPassword && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 my-2 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wide block">
                            સિસ્ટમ જનરેટેડ પાસવર્ડ:
                          </span>
                          <span className="font-mono font-bold text-base text-amber-950">
                            {n.temporaryPassword}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(n.temporaryPassword, n.id)}
                          className="btn-copy-sm"
                          title="પાસવર્ડ કૉપિ કરો"
                        >
                          {copiedId === n.id ? (
                            <Check size={14} className="text-emerald-600" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    )}

                    <div className="whitespace-pre-line bg-slate-50 rounded-lg p-2 text-slate-700 text-[11px] border border-slate-100 font-sans leading-relaxed">
                      {n.body}
                    </div>

                    {n.officerEmail && onLoginAsOfficer && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onLoginAsOfficer(n.officerEmail, n.temporaryPassword);
                        }}
                        className="mt-2 w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                      >
                        આ અધિકારી તરીકે લૉગ ઇન કરો <ArrowRight size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          <p className="text-xs text-slate-500 text-center">
            * ઉત્પાદન વાતાવરણમાં આ સૂચના સીધી અધિકારીના ઈમેલ ID પર મોકલવામાં આવે છે.
          </p>
        </div>
      </div>
    </div>
  );
}
