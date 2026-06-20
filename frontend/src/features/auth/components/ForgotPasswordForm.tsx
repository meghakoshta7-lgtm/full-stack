import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../../../components/common/Icons';
import { authApi } from '../api/auth.api';

interface Props {
  onBack: () => void;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

export const ForgotPasswordForm: React.FC<Props> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Email is required'); return; }
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-[44%] flex items-center justify-center px-5 py-5 lg:bg-[#f0eaf8]">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[440px]">
        <div className="rounded-[20px] px-10 py-8"
          style={{ background: '#ffffff', boxShadow: '0 8px 40px rgba(0, 0, 0, 0.06)', border: '1px solid rgba(99, 102, 241, 0.04)' }}>

          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item} className="text-center mb-6">
              <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.3 }}
                className="w-[56px] h-[56px] mx-auto mb-4 rounded-[16px] flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)' }}>
                <Icons.HelpCircle className="w-[26px] h-[26px] text-white" strokeWidth={1.5} />
              </motion.div>
              <h1 className="text-[22px] font-display font-bold" style={{ color: '#1e293b' }}>Forgot password?</h1>
              <p className="mt-1 text-[13px]" style={{ color: '#94a3b8' }}>Enter your email and we'll send you a reset link</p>
            </motion.div>

            {error && (
              <motion.div variants={item} className="mb-4 p-3 rounded-[10px] text-[12px] font-medium text-center"
                style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                {error}
              </motion.div>
            )}

            {sent ? (
              <motion.div variants={item} className="text-center py-4">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: '#ecfdf5' }}>
                  <Icons.CheckCircle className="w-7 h-7" style={{ color: '#10b981' }} />
                </div>
                <p className="text-[14px] font-semibold" style={{ color: '#1e293b' }}>Check your email</p>
                <p className="text-[12px] mt-1" style={{ color: '#64748b' }}>If that email is registered, you'll receive a reset link shortly.</p>
                <button onClick={onBack} className="mt-5 text-[13px] font-semibold hover:underline" style={{ color: '#6366f1' }}>
                  Back to sign in
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <motion.div variants={item} className="mb-5">
                  <label className="block text-[12px] font-semibold mb-1.5" style={{ color: '#475569' }}>Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icons.User className="w-[16px] h-[16px]" style={{ color: '#94a3b8' }} />
                    </div>
                    <input type="email" placeholder="you@example.com" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-[11px] rounded-[10px] outline-none text-[13px] transition-all"
                      style={{ border: '1.5px solid #e2e8f0', background: '#ffffff', color: '#1e293b' }}
                      onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
                  </div>
                </motion.div>

                <motion.div variants={item}>
                  <motion.button type="submit" disabled={loading}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full text-white py-[11px] px-4 rounded-[10px] font-semibold text-[14px] flex items-center justify-center space-x-2"
                    style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)' }}>
                    {loading ? <><Icons.Loader2 className="w-[16px] h-[16px] animate-spin" /><span>Sending...</span></>
                      : <><Icons.ArrowRight className="w-[16px] h-[16px]" /><span>Send reset link</span></>}
                  </motion.button>
                </motion.div>
              </form>
            )}

            <motion.div variants={item} className="text-center mt-5">
              <button onClick={onBack} className="text-[13px] font-semibold hover:underline" style={{ color: '#6366f1' }}>
                Back to sign in
              </button>
            </motion.div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
};
