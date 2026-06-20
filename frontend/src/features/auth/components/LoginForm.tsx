import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { Icons } from '../../../components/common/Icons';
import { Toast } from '../../../components/shared/Toast';
import { useToast } from '../../../hooks/useToast';

interface Props {
  formData: { email: string; password: string };
  error: string;
  loading: boolean;
  showPassword: boolean;
  rememberMe: boolean;
  selectedRole: string;
  onFormChange: (data: { email: string; password: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  onTogglePassword: () => void;
  onToggleRemember: (v: boolean) => void;
  onRoleChange: (role: string) => void;
  onGoogleSuccess: (credential: string) => void;
  onGoogleError: () => void;
  onForgotPassword: () => void;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

export const LoginForm: React.FC<Props> = ({
  formData, error, loading, showPassword, rememberMe, selectedRole,
  onFormChange, onSubmit, onTogglePassword, onToggleRemember, onRoleChange,
  onGoogleSuccess, onGoogleError, onForgotPassword
}) => {
  const { toasts, removeToast, showError } = useToast();
  useEffect(() => { if (error) showError('Login Failed', error); }, [error, showError]);
  return (
  <div className="w-full lg:w-[44%] flex items-center justify-center px-5 py-5 lg:bg-[#f0eaf8]">
    <Toast toasts={toasts} onRemove={removeToast} />
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[440px]">
      <div className="rounded-[20px] px-10 py-6"
        style={{ background: '#ffffff', boxShadow: '0 8px 40px rgba(0, 0, 0, 0.06)', border: '1px solid rgba(99, 102, 241, 0.04)' }}>

        <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item} className="text-center mb-4">
            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.3 }}
              className="w-[56px] h-[56px] mx-auto mb-4 rounded-[16px] flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)' }}>
              <Icons.Star className="w-[26px] h-[26px] text-white" strokeWidth={1.5} />
            </motion.div>
            <h1 className="text-[22px] font-display font-bold" style={{ color: '#1e293b' }}>Welcome Back</h1>
            <p className="mt-1 text-[13px]" style={{ color: '#94a3b8' }}>Sign in to your account</p>
          </motion.div>

          <form onSubmit={onSubmit}>
            <motion.div variants={item} className="mb-3">
              <label className="block text-[12px] font-semibold mb-1" style={{ color: '#475569' }}>Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icons.User className="w-[16px] h-[16px]" style={{ color: '#94a3b8' }} /></div>
                <input type="email" placeholder="you@example.com" value={formData.email}
                  onChange={(e) => onFormChange({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-[9px] rounded-[10px] outline-none text-[13px] transition-all"
                  style={{ border: '1.5px solid #e2e8f0', background: '#ffffff', color: '#1e293b' }}
                  onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
              </div>
            </motion.div>

            <motion.div variants={item} className="mb-3">
              <label className="block text-[12px] font-semibold mb-1" style={{ color: '#475569' }}>Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icons.Lock className="w-[16px] h-[16px]" style={{ color: '#94a3b8' }} /></div>
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={formData.password}
                  onChange={(e) => onFormChange({ ...formData, password: e.target.value })}
                  className="w-full pl-9 pr-10 py-[9px] rounded-[10px] outline-none text-[13px] transition-all"
                  style={{ border: '1.5px solid #e2e8f0', background: '#ffffff', color: '#1e293b' }}
                  onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
                <button type="button" onClick={onTogglePassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center" style={{ color: '#94a3b8' }}>
                  {showPassword ? <Icons.EyeOff className="w-[16px] h-[16px]" /> : <Icons.Eye className="w-[16px] h-[16px]" />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={item} className="mb-3">
              <label className="block text-[12px] font-semibold mb-1" style={{ color: '#475569' }}>Login as</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icons.User className="w-[16px] h-[16px]" style={{ color: '#94a3b8' }} /></div>
                <select value={selectedRole} onChange={(e) => onRoleChange(e.target.value)}
                  className="w-full pl-9 pr-8 py-[9px] rounded-[10px] outline-none text-[13px] transition-all appearance-none cursor-pointer"
                  style={{ border: '1.5px solid #e2e8f0', background: '#ffffff', color: '#1e293b' }}
                  onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}>
                  <option value="user">User</option>
                  <option value="store_owner">Store Owner</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Icons.ChevronDown className="w-[16px] h-[16px]" style={{ color: '#94a3b8' }} />
                </div>
              </div>
            </motion.div>

            <motion.div variants={item} className="flex items-center justify-between mb-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={rememberMe} onChange={(e) => onToggleRemember(e.target.checked)}
                  className="w-[14px] h-[14px] rounded cursor-pointer" style={{ accentColor: '#6366f1' }} />
                <span className="text-[12px]" style={{ color: '#64748b' }}>Remember me</span>
              </label>
              <button type="button" onClick={onForgotPassword} className="text-[12px] font-semibold hover:underline" style={{ color: '#6366f1' }}>Forgot password?</button>
            </motion.div>

            <motion.div variants={item}>
              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full text-white py-[9px] px-4 rounded-[10px] font-semibold text-[13px] flex items-center justify-center space-x-2"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)' }}>
                {loading ? <><Icons.Loader2 className="w-[16px] h-[16px] animate-spin" /><span>Signing in...</span></>
                  : <><Icons.KeyRound className="w-[16px] h-[16px]" /><span>Sign In</span></>}
              </motion.button>
            </motion.div>
          </form>

          <motion.div variants={item} className="relative my-3">
            <div className="absolute inset-0 flex items-center"><div className="w-full" style={{ borderTop: '1px solid #e2e8f0' }} /></div>
            <div className="relative flex justify-center text-[12px]"><span className="px-3 font-medium" style={{ background: '#ffffff', color: '#94a3b8' }}>OR</span></div>
          </motion.div>

          <motion.div variants={item}>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    onGoogleSuccess(credentialResponse.credential);
                  }
                }}
                onError={() => onGoogleError()}
                text="continue_with"
                shape="rectangular"
                size="large"
                width="100%"
                theme="outline"
              />
            </div>
          </motion.div>

          <motion.p variants={item} className="text-center mt-3 text-[13px]" style={{ color: '#94a3b8' }}>
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-bold hover:underline" style={{ color: '#6366f1' }}>Sign Up</Link>
          </motion.p>
        </motion.div>

      </div>
    </motion.div>
  </div>
);
}
