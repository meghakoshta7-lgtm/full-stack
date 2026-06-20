import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLogin } from '../hooks/useLogin';
import { IllustrationPanel } from '../components/IllustrationPanel';
import { LoginForm } from '../components/LoginForm';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { ResetPasswordForm } from '../components/ResetPasswordForm';
import { authApi } from '../api/auth.api';

type AuthView = 'login' | 'forgot' | 'reset';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, login } = useAuth();
  const state = location.state as { email?: string; password?: string } | null;
  const { formData, setFormData, error, loading, showPassword, setShowPassword, rememberMe, setRememberMe, selectedRole, setSelectedRole, handleSubmit } = useLogin();
  const [googleLoading, setGoogleLoading] = useState(false);

  const resetToken = searchParams.get('token') || '';

  const [view, setView] = useState<AuthView>(() => {
    if (location.pathname === '/forgot-password') return 'forgot';
    if (location.pathname === '/reset-password' && resetToken) return 'reset';
    return 'login';
  });

  useEffect(() => { if (state?.email) setFormData(prev => ({ ...prev, email: state.email!, password: state.password || '' })); }, []); // eslint-disable-line
  useEffect(() => { if (isAuthenticated) navigate('/', { replace: true }); }, [isAuthenticated, navigate]);
  useEffect(() => {
    if (location.pathname === '/forgot-password') setView('forgot');
    else if (location.pathname === '/reset-password' && resetToken) setView('reset');
    else if (location.pathname === '/login') setView('login');
  }, [location.pathname, resetToken]);

  const handleGoogleSuccess = async (credential: string) => {
    setGoogleLoading(true);
    try {
      const res = await authApi.googleLogin(credential);
      login(res.token, res.user);
      navigate('/');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Google login failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  const goToLogin = () => { setView('login'); navigate('/login', { replace: true }); };
  const goToForgot = () => { setView('forgot'); navigate('/forgot-password', { replace: true }); };

  if (view === 'forgot') {
    return (
      <div className="h-full flex flex-col bg-[#f0eaf8]">
        <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto">
          <IllustrationPanel />
          <ForgotPasswordForm onBack={goToLogin} />
        </div>
      </div>
    );
  }

  if (view === 'reset') {
    return (
      <div className="h-full flex flex-col bg-[#f0eaf8]">
        <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto">
          <IllustrationPanel />
          <ResetPasswordForm token={resetToken} onBack={goToLogin} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#f0eaf8]">
      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto">
        <IllustrationPanel />
        <LoginForm
          formData={formData} error={error || (googleLoading ? '' : '')} loading={loading || googleLoading}
          showPassword={showPassword} rememberMe={rememberMe} selectedRole={selectedRole}
          onFormChange={setFormData} onSubmit={handleSubmit}
          onTogglePassword={() => setShowPassword(!showPassword)}
          onToggleRemember={setRememberMe} onRoleChange={setSelectedRole}
          onGoogleSuccess={handleGoogleSuccess}
          onGoogleError={() => {}}
          onForgotPassword={goToForgot} />
      </div>
    </div>
  );
};

export default LoginPage;
