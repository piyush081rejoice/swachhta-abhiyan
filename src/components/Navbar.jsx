import React, { useState, useEffect } from 'react';
import {
  FileText, Users, PlusCircle, LayoutDashboard, Database,
  LogOut, Bell, KeyRound, User, ChevronDown, Menu, X, ShieldCheck
} from 'lucide-react';
import { notificationService } from '../services/notificationService';

export default function Navbar({
  user,
  activeTab,
  onTabChange,
  onLogout,
  onOpenNotifications,
  onOpenSqlModal,
  onOpenChangePassword
}) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setUnreadCount(notificationService.getUnreadCount());
    const handleUpdate = () => {
      setUnreadCount(notificationService.getUnreadCount());
    };
    window.addEventListener('swachhata_new_notification', handleUpdate);
    window.addEventListener('swachhata_notifications_changed', handleUpdate);
    return () => {
      window.removeEventListener('swachhata_new_notification', handleUpdate);
      window.removeEventListener('swachhata_notifications_changed', handleUpdate);
    };
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="brand-logo-badge">
            <span className="text-2xl">🦁</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="brand-title">સ્વચ્છતા સંકલ્પ પોર્ટલ</span>
              <span className={`role-badge ${isAdmin ? 'role-admin' : 'role-officer'}`}>
                {isAdmin ? 'ADMIN' : 'OFFICER'}
              </span>
            </div>
            <p className="brand-subtitle">
              {isAdmin
                ? 'રાજ્ય સંચાલન અને દેખરેખ પેનલ'
                : `${user?.municipality_name || 'નગરપાલિકા'} • ડોર-ટુ-ડોર સંકલ્પ`}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          {isAdmin ? (
            <>
              <button
                type="button"
                className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => onTabChange('dashboard')}
              >
                <LayoutDashboard size={16} /> ડેશબોર્ડ
              </button>
              <button
                type="button"
                className={`nav-link ${activeTab === 'officers' ? 'active' : ''}`}
                onClick={() => onTabChange('officers')}
              >
                <Users size={16} /> અધિકારી સંચાલન
              </button>
              <button
                type="button"
                className={`nav-link ${activeTab === 'forms' ? 'active' : ''}`}
                onClick={() => onTabChange('forms')}
              >
                <FileText size={16} /> બધા સંકલ્પ પત્રો
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => onTabChange('dashboard')}
              >
                <LayoutDashboard size={16} /> ડેશબોર્ડ
              </button>
              <button
                type="button"
                className={`nav-link primary-highlight ${activeTab === 'new-form' ? 'active' : ''}`}
                onClick={() => onTabChange('new-form')}
              >
                <PlusCircle size={16} /> નવો સંકલ્પ પત્ર ભરો
              </button>
              <button
                type="button"
                className={`nav-link ${activeTab === 'forms' ? 'active' : ''}`}
                onClick={() => onTabChange('forms')}
              >
                <FileText size={16} /> મારા સંકલ્પ પત્રો
              </button>
            </>
          )}
        </nav>

        {/* Right Action Icons & Profile */}
        <div className="navbar-right-controls">
        

          {/* User Profile dropdown */}
          <div className="user-profile-wrapper">
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="user-profile-btn"
              aria-expanded={showProfileMenu}
            >
              <div className="avatar-circle">
                {isAdmin ? 'A' : (user?.name ? user.name[0] : 'O')}
              </div>
              <div className="user-profile-text-block">
                <p className="user-name-label">
                  {isAdmin ? 'મુખ્ય વહીવટી અધિકારી' : user?.name}
                </p>
                <p className="user-role-label">
                  {isAdmin ? 'રાજ્ય સંચાલક (Admin)' : (user?.municipality_name || 'ફિલ્ડ ઓફિસર')}
                </p>
              </div>
              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`}
              />
            </button>

            {showProfileMenu && (
              <>
                <div
                  className="dropdown-overlay-scrim"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="profile-dropdown-card">
                  <div className="dropdown-accent-bar" />
                  <div className="profile-dropdown-header">
                    <div className="flex items-center gap-3">
                      <div className="avatar-circle-dropdown">
                        {isAdmin ? 'A' : (user?.name ? user.name[0] : 'O')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="dropdown-user-name truncate">
                          {user?.name || (isAdmin ? 'મુખ્ય વહીવટી અધિકારી' : 'અધિકારી')}
                        </p>
                        <p className="dropdown-user-email truncate">
                          {user?.email}
                        </p>
                        <div className="mt-1">
                          <span className="dropdown-role-chip">
                            {isAdmin ? '🏛️ ગાંધીનગર (મુખ્ય કાર્યાલય)' : `🏛️ ${user?.municipality_name || 'નગરપાલિકા'}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="profile-dropdown-actions">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onOpenChangePassword();
                      }}
                      className="profile-menu-item"
                    >
                      <div className="menu-icon-wrap icon-key">
                        <KeyRound size={15} />
                      </div>
                      <div className="menu-text-wrap">
                        <span className="menu-main-title">પાસવર્ડ બદલો</span>
                        <span className="menu-sub-title">તમારો પાસવર્ડ અપડેટ કરો</span>
                      </div>
                    </button>



                    
                    <div className="dropdown-divider" />

                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="profile-menu-item item-logout"
                    >
                      <div className="menu-icon-wrap icon-logout">
                        <LogOut size={15} />
                      </div>
                      <div className="menu-text-wrap">
                        <span className="menu-main-title text-red-600">લૉગ આઉટ (Sign Out)</span>
                        <span className="menu-sub-title">સુરક્ષિત સત્ર સમાપ્ત કરો</span>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu toggle button (visible ONLY on screens < 768px) */}
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation tray */}
      {mobileMenuOpen && (
        <div className="mobile-nav-tray">
          <div className="mobile-user-summary">
            <div className="avatar-circle-sm">
              {isAdmin ? 'A' : (user?.name ? user.name[0] : 'O')}
            </div>
            <div>
              <p className="font-bold text-slate-800 text-xs">{user?.name}</p>
              <p className="text-[11px] text-slate-500">{user?.email}</p>
            </div>
          </div>

          <div className="mobile-nav-links">
            {isAdmin ? (
              <>
                <button
                  type="button"
                  className={`mobile-nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => {
                    onTabChange('dashboard');
                    setMobileMenuOpen(false);
                  }}
                >
                  <LayoutDashboard size={16} /> ડેશબોર્ડ
                </button>
                <button
                  type="button"
                  className={`mobile-nav-link ${activeTab === 'officers' ? 'active' : ''}`}
                  onClick={() => {
                    onTabChange('officers');
                    setMobileMenuOpen(false);
                  }}
                >
                  <Users size={16} /> અધિકારી સંચાલન
                </button>
                <button
                  type="button"
                  className={`mobile-nav-link ${activeTab === 'forms' ? 'active' : ''}`}
                  onClick={() => {
                    onTabChange('forms');
                    setMobileMenuOpen(false);
                  }}
                >
                  <FileText size={16} /> બધા સંકલ્પ પત્રો
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className={`mobile-nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => {
                    onTabChange('dashboard');
                    setMobileMenuOpen(false);
                  }}
                >
                  <LayoutDashboard size={16} /> ડેશબોર્ડ
                </button>
                <button
                  type="button"
                  className={`mobile-nav-link primary ${activeTab === 'new-form' ? 'active' : ''}`}
                  onClick={() => {
                    onTabChange('new-form');
                    setMobileMenuOpen(false);
                  }}
                >
                  <PlusCircle size={16} /> નવો સંકલ્પ પત્ર ભરો
                </button>
                <button
                  type="button"
                  className={`mobile-nav-link ${activeTab === 'forms' ? 'active' : ''}`}
                  onClick={() => {
                    onTabChange('forms');
                    setMobileMenuOpen(false);
                  }}
                >
                  <FileText size={16} /> મારા સંકલ્પ પત્રો
                </button>
              </>
            )}
          </div>

          <div className="mobile-nav-actions">
            <button
              type="button"
              className="mobile-nav-action-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenChangePassword();
              }}
            >
              <KeyRound size={15} /> પાસવર્ડ બદલો
            </button>
            <button
              type="button"
              className="mobile-nav-action-btn text-red-600"
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
            >
              <LogOut size={15} /> લૉગ આઉટ
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
