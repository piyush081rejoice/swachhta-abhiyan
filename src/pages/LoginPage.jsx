import React, { useState } from 'react';
import {
  LogIn, Lock, Mail, ShieldCheck, Sparkles, KeyRound,
  AlertCircle, CheckCircle2, Building2, Landmark, Check, ArrowRight,
  Eye, EyeOff, Loader2
} from 'lucide-react';
import { authService } from '../services/authService';

export default function LoginPage({ onLoginSuccess }) {
  const [activeRoleTab, setActiveRoleTab] = useState('admin'); // 'admin' or 'officer'
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotError, setForgotError] = useState('');

  const handleRoleTabChange = (role) => {
    setActiveRoleTab(role);
    setError('');
    setShowPassword(false);
    if (role === 'admin') {
      setEmail('admin@gmail.com');
      setPassword('Admin@123');
    } else {
      setEmail('rajesh.officer@gmail.com');
      setPassword('Officer@123');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('કૃપા કરીને ઇમેઇલ અને પાસવર્ડ દાખલ કરો.');
      return;
    }

    try {
      setLoading(true);
      const res = await authService.login(email, password);
      if (res.success) {
        onLoginSuccess(res.user);
      }
    } catch (err) {
      setError(err.message || 'લૉગ ઇન કરવામાં સમસ્યા આવી.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotMsg('');

    if (!forgotEmail.trim()) {
      setForgotError('કૃપા કરીને તમારો નોંધાયેલ ઇમેઇલ દાખલ કરો.');
      return;
    }

    try {
      const res = await authService.requestPasswordReset(forgotEmail);
      setForgotMsg(res.message);
    } catch (err) {
      setForgotError(err.message || 'રીસેટ કરવામાં ક્ષતિ આવી.');
    }
  };

  return (
    <div className="login-page-root">
      {/* Background Ambience */}
      <div className="login-bg-glow glow-top-left"></div>
      <div className="login-bg-glow glow-bottom-right"></div>

      <div className="login-main-card">
        {/* Left Side: Brand Showcase & Official Mission Information */}
        <div className="login-brand-panel">
          <div className="brand-panel-header">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏛️</span>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300">
                  ગુજરાત સરકાર • શહેરી વિકાસ વિભાગ
                </p>
                <p className="text-xs text-emerald-100/90 font-medium">
                  Swachh Bharat Mission (Urban) - Gujarat
                </p>
              </div>
            </div>
          </div>

          <div className="brand-panel-body">
            <div className="mascot-badge-box">
              <span className="text-5xl drop-shadow-md">🦁</span>
              <div className="mascot-text">
                <span className="mascot-slogan">મારૂ શહેર મારૂ ગૌરવ</span>
                <span className="mascot-sub">સ્વચ્છતા સંકલ્પ મહા-અભિયાન</span>
              </div>
            </div>

            <h2 className="brand-heading">
              સ્વચ્છ અને સ્વસ્થ ગુજરાતના નિર્માણ માટે નાગરિક સંકલ્પ પત્ર
            </h2>
            <p className="brand-desc">
              રાજ્યની તમામ મહાનગરપાલિકાઓ અને નગરપાલિકાઓ માટે સેન્ટ્રલાઇઝ્ડ ઓનલાઇન ડોર-ટુ-ડોર સંકલ્પ પત્ર નોંધણી, ડિજિટલ સહી અને તાત્કાલિક PDF પ્રમાણપત્ર સંચાલન પ્રણાલી.
            </p>

            <div className="mission-highlights-grid">
              <div className="highlight-pill">
                <span className="highlight-icon">✓</span>
                <span>૧૦૦% ડિજિટલ સહી સંકલન</span>
              </div>
              <div className="highlight-pill">
                <span className="highlight-icon">✓</span>
                <span>તાત્કાલિક સત્તાવાર PDF જનરેશન</span>
              </div>
            </div>
          </div>

          <div className="brand-panel-footer">
            <div className="flex items-center gap-2 text-xs text-emerald-200/80">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>સુરક્ષિત ગવર્નન્સ પોર્ટલ </span>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="login-form-panel">
          <div className="login-form-header">
            <div className="login-badge-tag">
              <Sparkles size={13} className="text-emerald-600" />
              <span>સત્તાવાર પ્રમાણીકરણ</span>
            </div>
            <h3 className="login-title">
              પોર્ટલ લૉગિન
            </h3>
            <p className="login-subtitle">
              તમારી ભૂમિકા (Role) પસંદ કરી સુરક્ષિત ઓળખપત્રો સાથે પ્રવેશ કરો
            </p>
          </div>

          {/* Role Tabs */}
          <div className="login-role-tabs">
            <button
              type="button"
              onClick={() => handleRoleTabChange('admin')}
              className={`role-tab-btn ${activeRoleTab === 'admin' ? 'active' : ''}`}
            >
              <Landmark size={17} />
              <span>એડમિન (Admin)</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleTabChange('officer')}
              className={`role-tab-btn ${activeRoleTab === 'officer' ? 'active' : ''}`}
            >
              <Building2 size={17} />
              <span>ઓફિસર (Officer)</span>
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="login-form-body">
            {error && (
              <div className="alert-error flex items-start gap-2 text-xs">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="login-field">
              <label className="login-label">
                ઇમેઇલ સરનામું (Email Address)
              </label>
              <div className="login-input-wrap">
                <Mail size={17} className="login-input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={activeRoleTab === 'admin' ? 'admin@gmail.com' : 'officer@gmail.com'}
                  className="login-input"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-field">
              <div className="login-field-header">
                <label className="login-label">
                  પાસવર્ડ (Password)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setShowForgotModal(true);
                  }}
                  className="login-forgot-link"
                >
                  પાસવર્ડ ભૂલી ગયા છો?
                </button>
              </div>
              <div className="login-input-wrap">
                <Lock size={17} className="login-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="તમારો પાસવર્ડ દાખલ કરો"
                  className="login-input has-eye"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-eye-btn"
                  title={showPassword ? "પાસવર્ડ છુપાવો (Hide password)" : "પાસવર્ડ જુઓ (Show password)"}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-submit-btn"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>ચકાસણી થઈ રહી છે...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>
                    {activeRoleTab === 'admin' ? 'એડમિન પેનલમાં પ્રવેશ કરો' : 'ઓફિસર ડેશબોર્ડમાં પ્રવેશ કરો'}
                  </span>
                  <ArrowRight size={16} className="btn-arrow-icon" />
                </>
              )}
            </button>

            {/* Quick Demo Credentials Helper */}
            <div className="login-credentials-hint">
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <KeyRound size={13} className="text-emerald-600 flex-shrink-0" />
                <span>ડેમો ઓળખપત્રો: <strong>{activeRoleTab === 'admin' ? 'એડમિન' : 'ઑફિસર'}</strong></span>
              </span>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md font-bold">
                Auto-filled ✓
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-backdrop">
          <div className="modal-container max-w-sm">
            <div className="modal-header">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                  <KeyRound size={18} />
                </div>
                <div>
                  <h3 className="modal-title">પાસવર્ડ પુનઃપ્રાપ્તિ</h3>
                  <p className="text-[11px] text-slate-500 font-normal">Password Recovery</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotMsg('');
                  setForgotError('');
                }}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                title="બંધ કરો"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleForgotPassword}>
              <div className="modal-body space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  તમારો નોંધાયેલ ઇમેઇલ દાખલ કરો. પાસવર્ડ રીસેટ કરવાની અધિકૃત વિગતો આ સરનામે મોકલવામાં આવશે.
                </p>

                {forgotError && (
                  <div className="alert-error text-xs flex items-center gap-2 p-2.5 rounded-lg">
                    <AlertCircle size={14} className="flex-shrink-0" />
                    <span>{forgotError}</span>
                  </div>
                )}
                {forgotMsg && (
                  <div className="alert-success text-xs flex items-center gap-2 p-2.5 rounded-lg">
                    <CheckCircle2 size={14} className="flex-shrink-0" />
                    <span>{forgotMsg}</span>
                  </div>
                )}

                <div className="modal-field">
                  <label className="modal-label">નોંધાયેલ ઇમેઇલ સરનામું *</label>
                  <div className="login-input-wrap">
                    <Mail size={16} className="login-input-icon" />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      placeholder="દા.ત. officer@gmail.com"
                      className="login-input py-2.5 text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="btn btn-secondary text-xs px-3.5 py-2 font-semibold"
                >
                  બંધ કરો
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs px-4 py-2 font-bold shadow-md shadow-emerald-700/20"
                >
                  રીસેટ વિગતો મોકલો
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
