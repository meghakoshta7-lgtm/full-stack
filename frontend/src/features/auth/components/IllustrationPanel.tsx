import React from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../../../components/common/Icons';

const features = [
  { icon: Icons.Star, title: 'Rate & Review', desc: 'Share your experience and help others.' },
  { icon: Icons.BarChart3, title: 'Track Performance', desc: 'Stores improve based on your feedback.' },
  { icon: Icons.Shield, title: 'Trusted & Secure', desc: 'Your data is safe and encrypted.' },
];

const bottomItems = [
  { icon: Icons.Lock, label: 'Secure & Private', desc: 'Your data is 100% protected' },
  { icon: Icons.Eye, label: 'Fair & Transparent', desc: 'Ratings you can trust' },
  { icon: Users, label: 'Community Driven', desc: 'Better stores, better experience' },
];

function Users(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

export const IllustrationPanel: React.FC = () => (
  <div className="hidden lg:flex lg:w-[56%] relative overflow-hidden flex-col bg-[#f0eaf8]">
    <div className="absolute top-[14%] left-[18%] w-[6px] h-[6px] rounded-full" style={{ background: '#c4a8f0', opacity: 0.55 }} />
    <div className="absolute top-[9%] left-[44%] w-[5px] h-[5px] rounded-full" style={{ background: '#b89ae8', opacity: 0.45 }} />
    <div className="absolute top-[20%] right-[28%] w-[7px] h-[7px] rounded-full" style={{ background: '#d4bef5', opacity: 0.45 }} />
    <div className="absolute top-[11%] right-[19%] w-[5px] h-[5px] rounded-full" style={{ background: '#c0a0e8', opacity: 0.55 }} />
    <div className="absolute bottom-[38%] left-[9%] w-[6px] h-[6px] rounded-full" style={{ background: '#c8b0f0', opacity: 0.4 }} />
    <div className="absolute top-[32%] left-[4%] w-[4px] h-[4px] rounded-full" style={{ background: '#b090e0', opacity: 0.55 }} />
    <div className="absolute bottom-[18%] right-[9%] w-[5px] h-[5px] rounded-full" style={{ background: '#d0c0f5', opacity: 0.45 }} />
    <div className="absolute bottom-[52%] right-[4%] w-[4px] h-[4px] rounded-full" style={{ background: '#b8a0e8', opacity: 0.5 }} />

    <div className="flex-1 flex flex-col justify-between px-12 py-10 relative z-10">
      <div>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
          style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
          <Icons.BadgeCheck className="w-4 h-4" style={{ color: '#6366f1' }} />
          <span className="text-[12px] font-semibold" style={{ color: '#6366f1' }}>Trusted by 10,000+ Stores</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-[40px] font-display font-extrabold leading-[1.1]" style={{ color: '#1e293b' }}>Rate Stores.</h2>
          <h2 className="text-[40px] font-display font-extrabold leading-[1.1]" style={{ color: '#6366f1' }}>Share Feedback.</h2>
          <p className="text-[14px] mt-3 max-w-[300px] leading-relaxed" style={{ color: '#64748b' }}>Your feedback helps stores grow and serve you better.</p>
        </motion.div>

        <div className="mt-8 space-y-3">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-xl max-w-[300px]"
              style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(99, 102, 241, 0.08)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #ede9fe 0%, #e0e7ff 100%)' }}>
                <f.icon className="w-4 h-4" style={{ color: '#6366f1' }} />
              </div>
              <div>
                <p className="text-[13px] font-bold" style={{ color: '#1e293b' }}>{f.title}</p>
                <p className="text-[11px]" style={{ color: '#64748b' }}>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-8 mt-6 pt-6" style={{ borderTop: '1px solid rgba(99, 102, 241, 0.1)' }}>
        {bottomItems.map((b, i) => (
          <motion.div key={b.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + i * 0.1 }}
            className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(99, 102, 241, 0.06)' }}>
              <b.icon className="w-3.5 h-3.5" style={{ color: '#6366f1' }} />
            </div>
            <div>
              <p className="text-[11px] font-bold" style={{ color: '#1e293b' }}>{b.label}</p>
              <p className="text-[10px]" style={{ color: '#94a3b8' }}>{b.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' as const }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[58%] pointer-events-none">
      <img src="/assets/login-illustration.png" alt="Store Rating Illustration"
        className="w-[850px] max-w-none h-auto object-contain"
        style={{ filter: 'drop-shadow(0 20px 40px rgba(120, 100, 180, 0.2))' }} />
    </motion.div>
  </div>
);
