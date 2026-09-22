import React, { useState } from 'react';
import { X, KeyRound, Lock, CheckCircle2, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';

export default function ChangePasswordModal({ isOpen, onClose, user }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('બધા ફિલ્ડ ભરવા ફરજિયાત છે.');
      return;
    }

    if (newPassword.length < 6) {
      setError('નવો પાસવર્ડ ઓછામાં ઓછો 6 અક્ષરોનો હોવો જોઈએ.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('નવો પાસવર્ડ અને કન્ફર્મ પાસવર્ડ મેળ ખાતા નથી.');
      return;
    }

    try {
      setLoading(true);
      await authService.changePassword(currentPassword, newPassword);
      setSuccess('પાસવર્ડ સફળતાપૂર્વક બદલાઈ ગયો છે!');
      setTimeout(() => {
        onClose();
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setSuccess('');
      }, 1800);
    } catch (err) {
      setError(err.message || 'પાસવર્ડ બદલવામાં ભૂલ આવી.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container max-w-sm">
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <KeyRound size={18} />
            </div>
            <div>
              <h3 className="modal-title">પાસવર્ડ બદલો</h3>
              <p className="text-[11px] text-slate-500 truncate max-w-[220px]">{user?.name} ({user?.email})</p>
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

        <form onSubmit={handleSubmit}>
          <div className="modal-body space-y-4">
            {error && (
              <div className="alert-error text-xs flex items-center gap-2 p-2.5 rounded-lg">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert-success text-xs flex items-center gap-2 p-2.5 rounded-lg">
                <CheckCircle2 size={14} className="flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <div className="modal-field">
              <label className="modal-label">હાલનો પાસવર્ડ (Current Password)</label>
              <div className="login-input-wrap">
                <Lock size={15} className="login-input-icon" />
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="હાલનો પાસવર્ડ દાખલ કરો"
                  className="login-input has-eye py-2.5 text-xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="password-eye-btn"
                  title={showCurrent ? "પાસવર્ડ છુપાવો" : "પાસવર્ડ જુઓ"}
                >
                  {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="modal-field">
              <label className="modal-label">નવો પાસવર્ડ (New Password - Min 6 chars)</label>
              <div className="login-input-wrap">
                <Lock size={15} className="login-input-icon" />
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="નવો પાસવર્ડ"
                  className="login-input has-eye py-2.5 text-xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="password-eye-btn"
                  title={showNew ? "પાસવર્ડ છુપાવો" : "પાસવર્ડ જુઓ"}
                >
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="modal-field">
              <label className="modal-label">નવો પાસવર્ડ ફરી દાખલ કરો (Confirm)</label>
              <div className="login-input-wrap">
                <Lock size={15} className="login-input-icon" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="કન્ફર્મ પાસવર્ડ"
                  className="login-input has-eye py-2.5 text-xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="password-eye-btn"
                  title={showConfirm ? "પાસવર્ડ છુપાવો" : "પાસવર્ડ જુઓ"}
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary text-xs px-3 py-1.5">
              રદ કરો
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary text-xs px-3.5 py-1.5 font-bold shadow-xs">
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> સાચવી રહ્યું છે...
                </>
              ) : (
                'પાસવર્ડ સાચવો'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
