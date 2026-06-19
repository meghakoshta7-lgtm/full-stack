import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icons } from '../../../components/common/Icons';
import { Toast } from '../../../components/shared/Toast';
import { useToast } from '../../../hooks/useToast';
import { DemoAccount } from '../types';

const demoAccounts: DemoAccount[] = [
  { label: 'Admin', email: 'admin@example.com', password: 'Admin@123', icon: Icons.Shield },
  { label: 'Store Owner', email: 'owner1@example.com', password: 'Owner@123', icon: Icons.Store },
  { label: 'User', email: 'user1@example.com', password: 'User@1234', icon: Icons.User },
];

interface Props {
  formData: { email: string; password: string };
  error: string;
  loading: boolean;
  showPassword: boolean;
  rememberMe: boolean;
  onFormChange: (data: { email: string; password: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  onQuickLogin: (email: string, password: string) => void;
  onTogglePassword: () => void;
  onToggleRemember: (v: boolean) => void;
}

export const LoginForm: React.FC<Props> = ({
  formData, error, loading, showPassword, rememberMe,
  onFormChange, onSubmit, onQuickLogin, onTogglePassword, onToggleRemember
}) => {
  const { toasts, removeToast, showError } = useToast();
  useEffect(() => { if (error) showError('Login Failed', error); }, [error, showError]);
  return (
  <div className="w-full lg:w-[44%] flex items-center justify-center px-5 py-5 bg-[#f0eaf8]">
    <Toast toasts={toasts} onRemove={removeToast} />
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-[460px]">
      <div className="rounded-[20px] px-10 py-8"
        style={{ background: '#ffffff', boxShadow: '0 8px 40px rgba(0, 0, 0, 0.06)', border: '1px solid rgba(99, 102, 241, 0.04)' }}>
        <div className="text-center mb-6">
          <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
            className="w-[60px] h-[60px] mx-auto mb-4 rounded-[16px] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)' }}>
            <Icons.Star className="w-[28px] h-[28px] text-white" strokeWidth={1.5} />
          </motion.div>
          <h1 className="text-[22px] font-display font-bold" style={{ color: '#1e293b' }}>Welcome Back</h1>
          <p className="mt-1 text-[13px]" style={{ color: '#94a3b8' }}>Sign in to your account</p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-[12px] font-semibold mb-1.5" style={{ color: '#475569' }}>Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icons.User className="w-[16px] h-[16px]" style={{ color: '#94a3b8' }} /></div>
              <input type="email" placeholder="user156@example.com" value={formData.email}
                onChange={(e) => onFormChange({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3 py-[11px] rounded-[10px] outline-none text-[13px] transition-all"
                style={{ border: '1.5px solid #e2e8f0', background: '#ffffff', color: '#1e293b' }}
                onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[12px] font-semibold mb-1.5" style={{ color: '#475569' }}>Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icons.Lock className="w-[16px] h-[16px]" style={{ color: '#94a3b8' }} /></div>
              <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={formData.password}
                onChange={(e) => onFormChange({ ...formData, password: e.target.value })}
                className="w-full pl-9 pr-10 py-[11px] rounded-[10px] outline-none text-[13px] transition-all"
                style={{ border: '1.5px solid #e2e8f0', background: '#ffffff', color: '#1e293b' }}
                onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
              <button type="button" onClick={onTogglePassword}
                className="absolute inset-y-0 right-0 pr-3 flex items-center" style={{ color: '#94a3b8' }}>
                {showPassword ? <Icons.EyeOff className="w-[16px] h-[16px]" /> : <Icons.Eye className="w-[16px] h-[16px]" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-5">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" checked={rememberMe} onChange={(e) => onToggleRemember(e.target.checked)}
                className="w-[14px] h-[14px] rounded cursor-pointer" style={{ accentColor: '#6366f1' }} />
              <span className="text-[12px]" style={{ color: '#64748b' }}>Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-[12px] font-semibold hover:underline" style={{ color: '#6366f1' }}>Forgot password?</Link>
          </div>

          <motion.button type="submit" disabled={loading}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full text-white py-[11px] px-4 rounded-[10px] font-semibold text-[14px] flex items-center justify-center space-x-2"
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)' }}>
            {loading ? <><Icons.Loader2 className="w-[16px] h-[16px] animate-spin" /><span>Signing in...</span></>
              : <><Icons.KeyRound className="w-[16px] h-[16px]" /><span>Sign In</span></>}
          </motion.button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full" style={{ borderTop: '1px solid #e2e8f0' }} /></div>
          <div className="relative flex justify-center text-[11px]"><span className="px-3 font-medium" style={{ background: '#ffffff', color: '#94a3b8' }}>Demo accounts</span></div>
        </div>

        <div className="space-y-2.5">
          {demoAccounts.map((acc) => {
            const Icon = acc.icon;
            return (
              <div key={acc.email}
                className="flex items-center gap-3 py-3 px-4 rounded-[12px] cursor-default select-none"
                style={{ border: '1.5px solid #f1f5f9', background: '#f8fafc' }}>
                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #ede9fe 0%, #e0e7ff 100%)' }}>
                  <Icon className="w-4 h-4" style={{ color: '#6366f1' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold truncate" style={{ color: '#334155' }}>{acc.label}</p>
                  <p className="text-[11px] truncate" style={{ color: '#94a3b8' }}>{acc.email}</p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center mt-5 text-[13px]" style={{ color: '#94a3b8' }}>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-bold hover:underline" style={{ color: '#6366f1' }}>Sign Up</Link>
        </p>
      </div>
    </motion.div>
  </div>
);}
