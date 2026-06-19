import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLogin } from '../hooks/useLogin';
import { IllustrationPanel } from '../components/IllustrationPanel';
import { LoginForm } from '../components/LoginForm';
import { authApi } from '../api/auth.api';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();
  const state = location.state as { email?: string; password?: string } | null;
  const { formData, setFormData, error, loading, showPassword, setShowPassword, rememberMe, setRememberMe, handleSubmit } = useLogin();
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => { if (state?.email) setFormData(prev => ({ ...prev, email: state.email!, password: state.password || '' })); }, []); // eslint-disable-line
  useEffect(() => { if (isAuthenticated) navigate('/', { replace: true }); }, [isAuthenticated, navigate]);

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

  return (
    <div className="h-full flex flex-col bg-[#f0eaf8]">
      <div className="flex-1 flex">
        <IllustrationPanel />
        <LoginForm
          formData={formData} error={error || (googleLoading ? '' : '')} loading={loading || googleLoading}
          showPassword={showPassword} rememberMe={rememberMe}
          onFormChange={setFormData} onSubmit={handleSubmit}
          onTogglePassword={() => setShowPassword(!showPassword)}
          onToggleRemember={setRememberMe}
          onGoogleSuccess={handleGoogleSuccess}
          onGoogleError={() => {}} />
      </div>
    </div>
  );
};

export default LoginPage;
