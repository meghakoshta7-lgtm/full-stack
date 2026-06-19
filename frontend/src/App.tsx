import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage';
import AdminDashboard from './features/admin/pages/AdminDashboard';
import UserManagement from './features/admin/pages/UserManagement';
import StoreManagement from './features/admin/pages/StoreManagement';
import StoreList from './features/stores/pages/StoreList';
import OwnerDashboard from './features/owner/pages/OwnerDashboard';
import ChangePassword from './components/common/ChangePassword';
import ProtectedRoute from './components/common/ProtectedRoute';
import Unauthorized from './components/common/Unauthorized';
import { UserRole } from './types';
import { slideUp } from './utils/animations';

const AnimatedPage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div variants={slideUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}>
    {children}
  </motion.div>
);

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password' || location.pathname.startsWith('/reset-password');

  const getHomeRedirect = () => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    switch (user?.role) { case 'admin': return <Navigate to="/admin/dashboard" replace />; case 'store_owner': return <Navigate to="/owner/dashboard" replace />; default: return <Navigate to="/stores" replace />; }
  };

  if (isAuthPage) {
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 min-h-0 bg-[#f0eaf8]">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  const isStorePage = location.pathname === '/stores';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-1 ${isStorePage ? '' : 'py-6 bg-[#f8fafc]'}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/unauthorized" element={<AnimatedPage><Unauthorized /></AnimatedPage>} />
            <Route path="/change-password" element={<AnimatedPage><ProtectedRoute><ChangePassword /></ProtectedRoute></AnimatedPage>} />
            <Route path="/admin/dashboard" element={<AnimatedPage><ProtectedRoute allowedRoles={[UserRole.ADMIN]}><AdminDashboard /></ProtectedRoute></AnimatedPage>} />
            <Route path="/admin/users" element={<AnimatedPage><ProtectedRoute allowedRoles={[UserRole.ADMIN]}><UserManagement /></ProtectedRoute></AnimatedPage>} />
            <Route path="/admin/stores" element={<AnimatedPage><ProtectedRoute allowedRoles={[UserRole.ADMIN]}><StoreManagement /></ProtectedRoute></AnimatedPage>} />
            <Route path="/stores" element={<AnimatedPage><ProtectedRoute allowedRoles={[UserRole.USER]}><StoreList /></ProtectedRoute></AnimatedPage>} />
            <Route path="/owner/dashboard" element={<AnimatedPage><ProtectedRoute allowedRoles={[UserRole.STORE_OWNER]}><OwnerDashboard /></ProtectedRoute></AnimatedPage>} />
            <Route path="/" element={getHomeRedirect()} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
};

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

const App: React.FC = () => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  </GoogleOAuthProvider>
);

export default App;