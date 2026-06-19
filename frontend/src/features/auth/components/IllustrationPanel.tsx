import React from 'react';
import { motion } from 'framer-motion';

export const IllustrationPanel: React.FC = () => (
  <div className="hidden lg:flex lg:w-[56%] relative overflow-hidden items-center justify-center bg-[#f0eaf8]">
    <div className="absolute top-[14%] left-[18%] w-[6px] h-[6px] rounded-full" style={{ background: '#c4a8f0', opacity: 0.55 }} />
    <div className="absolute top-[9%] left-[44%] w-[5px] h-[5px] rounded-full" style={{ background: '#b89ae8', opacity: 0.45 }} />
    <div className="absolute top-[20%] right-[28%] w-[7px] h-[7px] rounded-full" style={{ background: '#d4bef5', opacity: 0.45 }} />
    <div className="absolute top-[11%] right-[19%] w-[5px] h-[5px] rounded-full" style={{ background: '#c0a0e8', opacity: 0.55 }} />
    <div className="absolute bottom-[38%] left-[9%] w-[6px] h-[6px] rounded-full" style={{ background: '#c8b0f0', opacity: 0.4 }} />
    <div className="absolute top-[32%] left-[4%] w-[4px] h-[4px] rounded-full" style={{ background: '#b090e0', opacity: 0.55 }} />
    <div className="absolute bottom-[18%] right-[9%] w-[5px] h-[5px] rounded-full" style={{ background: '#d0c0f5', opacity: 0.45 }} />
    <div className="absolute bottom-[52%] right-[4%] w-[4px] h-[4px] rounded-full" style={{ background: '#b8a0e8', opacity: 0.5 }} />

    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex items-center justify-center mt-[-60px]">
      <img src="/assets/login-illustration.png" alt="Store Rating Illustration"
        className="w-[520px] h-auto object-contain"
        style={{ filter: 'drop-shadow(0 20px 40px rgba(120, 100, 180, 0.2))' }} />
    </motion.div>

    <motion.div
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
      className="absolute bottom-16 left-10 z-10">
      <h2 className="text-[40px] font-display font-extrabold leading-[1.1]" style={{ color: '#1e293b' }}>Rate Stores.</h2>
      <h2 className="text-[40px] font-display font-extrabold leading-[1.1]" style={{ color: '#6366f1' }}>Share Feedback.</h2>
      <p className="text-[13px] mt-3 max-w-[280px] leading-relaxed" style={{ color: '#64748b' }}>Your feedback helps stores grow and serve you better.</p>
      <div className="w-[42px] h-[3px] rounded-full mt-5" style={{ background: '#6366f1' }} />
    </motion.div>
  </div>
);
