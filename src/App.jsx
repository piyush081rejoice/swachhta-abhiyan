import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminOfficers from './pages/AdminOfficers';
import AdminForms from './pages/AdminForms';
import OfficerDashboard from './pages/OfficerDashboard';
import OfficerNewForm from './pages/OfficerNewForm';
import OfficerForms from './pages/OfficerForms';
import PdfPreviewModal from './components/PdfPreviewModal';
import NotificationDrawer from './components/NotificationDrawer';
import SqlModal from './components/SqlModal';
import ChangePasswordModal from './components/ChangePasswordModal';
import { authService } from './services/authService';

export default function App() {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tabParams, setTabParams] = useState({});

  // Modals state
  const [previewFormData, setPreviewFormData] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => {
      const u = authService.getCurrentUser();
      setUser(u);
      setActiveTab('dashboard');
    };

    const handleOpenSql = () => setShowSqlModal(true);

    window.addEventListener('swachhata_auth_changed', handleAuthChange);
    window.addEventListener('swachhata_open_sql_modal', handleOpenSql);

    return () => {
      window.removeEventListener('swachhata_auth_changed', handleAuthChange);
      window.removeEventListener('swachhata_open_sql_modal', handleOpenSql);
    };
  }, []);

  const handleNavigate = (tab, params = {}) => {
    setActiveTab(tab);
    setTabParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  const handleLoginAsOfficer = async (email, password) => {
    try {
      const res = await authService.login(email, password);
      if (res.success) {
        setUser(res.user);
        setActiveTab('dashboard');
        setShowNotifications(false);
      }
    } catch (err) {
      alert('લૉગ ઇન કરવામાં ભૂલ: ' + err.message);
    }
  };

  // If user is not authenticated, display Login page
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
        <LoginPage onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />
        
        {/* Email drawer accessible on login page for quick testing */}
        <NotificationDrawer
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          onLoginAsOfficer={handleLoginAsOfficer}
        />
      </div>
    );
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <Navbar
        user={user}
        activeTab={activeTab}
        onTabChange={handleNavigate}
        onLogout={handleLogout}
        onOpenNotifications={() => setShowNotifications(true)}
        onOpenSqlModal={() => setShowSqlModal(true)}
        onOpenChangePassword={() => setShowChangePassword(true)}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {isAdmin ? (
          <>
            {activeTab === 'dashboard' && (
              <AdminDashboard
                onNavigate={handleNavigate}
                onPreviewPdf={(formData) => setPreviewFormData(formData)}
              />
            )}
            {activeTab === 'officers' && (
              <AdminOfficers
                initialOpenCreate={Boolean(tabParams.openCreate)}
                onLoginAsOfficer={handleLoginAsOfficer}
              />
            )}
            {activeTab === 'forms' && (
              <AdminForms
                initialMunicipalityType={tabParams.municipalityType || 'All'}
                onPreviewPdf={(formData) => setPreviewFormData(formData)}
              />
            )}
          </>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <OfficerDashboard
                user={user}
                onNavigate={handleNavigate}
                onPreviewPdf={(formData) => setPreviewFormData(formData)}
              />
            )}
            {activeTab === 'new-form' && (
              <OfficerNewForm
                user={user}
                onNavigate={handleNavigate}
                onPreviewPdf={(formData) => setPreviewFormData(formData)}
              />
            )}
            {activeTab === 'forms' && (
              <OfficerForms
                user={user}
                onNavigate={handleNavigate}
                onPreviewPdf={(formData) => setPreviewFormData(formData)}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="portal-footer">
        <div className="footer-container">
          <div className="footer-brand-section">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg">🦁</span>
              <span className="font-bold text-slate-800 text-sm sm:text-base">સ્વચ્છતા સંકલ્પ પત્ર પોર્ટલ</span>
            </div>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="text-xs text-slate-500 font-medium">સ્વચ્છ ભારત મિશન - ગુજરાત</span>
          </div>
          <div className="footer-copyright">
            © 2026 ગુજરાત નગરીય વિકાસ મિશન. સર્વ હક સુરક્ષિત.
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PdfPreviewModal
        isOpen={Boolean(previewFormData)}
        formData={previewFormData}
        onClose={() => setPreviewFormData(null)}
      />

      <NotificationDrawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onLoginAsOfficer={handleLoginAsOfficer}
      />

      <SqlModal
        isOpen={showSqlModal}
        onClose={() => setShowSqlModal(false)}
      />

      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        user={user}
      />
    </div>
  );
}
