import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLogin } from '../hooks/useLogin';
import { IllustrationPanel } from '../components/IllustrationPanel';
import { LoginForm } from '../components/LoginForm';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const state = location.state as { email?: string; password?: string } | null;
  const { formData, setFormData, error, loading, showPassword, setShowPassword, rememberMe, setRememberMe, handleSubmit } = useLogin();

  useEffect(() => { if (state?.email) setFormData(prev => ({ ...prev, email: state.email!, password: state.password || '' })); }, []); // eslint-disable-line
  useEffect(() => { if (isAuthenticated) navigate('/', { replace: true }); }, [isAuthenticated, navigate]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#f8f9fc]">
      <div className="flex-1 flex min-h-0">
        <IllustrationPanel />
        <LoginForm
          formData={formData} error={error} loading={loading}
          showPassword={showPassword} rememberMe={rememberMe}
          onFormChange={setFormData} onSubmit={handleSubmit}
          onTogglePassword={() => setShowPassword(!showPassword)}
          onToggleRemember={setRememberMe} />
      </div>
      <div className="py-3 text-center bg-[#f0eaf8]">
        <p className="text-[12px]" style={{ color: '#94a3b8' }}>&copy; 2026 Store Rating System. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LoginPage;
