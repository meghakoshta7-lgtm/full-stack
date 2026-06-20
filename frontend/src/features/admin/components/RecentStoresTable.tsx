import React from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../../../components/common/Icons';

interface Props { stores: any[]; onManage: () => void }

const colors = ['#f97316', '#6366f1', '#10b981', '#8b5cf6'];

export const RecentStoresTable: React.FC<Props> = ({ stores, onManage }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
    className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: '#f1f5f9' }}>
    <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#f1f5f9' }}>
      <h2 className="text-[15px] font-semibold flex items-center space-x-2" style={{ color: '#1e293b' }}>
        <Icons.Store className="w-[18px] h-[18px]" style={{ color: '#6366f1' }} /><span>Recent Stores</span>
      </h2>
      <button onClick={onManage} className="text-[13px] font-semibold flex items-center space-x-1 hover:underline" style={{ color: '#6366f1' }}>
        <span>Manage Stores</span><Icons.ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
    <div className="hidden md:block overflow-x-auto max-h-[320px] overflow-y-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Name</th>
            <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Email</th>
            <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Rating</th>
          </tr>
        </thead>
        <tbody className="divide-y" style={{ borderColor: '#f1f5f9' }}>
          {stores.map((store: any, i: number) => (
            <motion.tr key={store.id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.05 }}
              className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: colors[i % colors.length] }}>
                    <Icons.Store className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium" style={{ color: '#1e293b' }}>{store.name}</span>
                </div>
              </td>
              <td className="px-6 py-3" style={{ color: '#64748b' }}>{store.email}</td>
              <td className="px-6 py-3">
                <div className="flex items-center space-x-1.5">
                  <Icons.Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold" style={{ color: '#1e293b' }}>{(store.overallRating ?? 0).toFixed(1)}</span>
                </div>
              </td>
            </motion.tr>
          ))}
          {stores.length === 0 && <tr><td colSpan={3} className="text-center py-8" style={{ color: '#94a3b8' }}>No stores yet</td></tr>}
        </tbody>
      </table>
    </div>


    <div className="md:hidden max-h-[320px] overflow-y-auto">
      {stores.map((store: any, i: number) => (
        <motion.div key={store.id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.05 }}
          className="px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors flex items-center justify-between" style={{ borderColor: '#f1f5f9' }}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: colors[i % colors.length] }}>
              <Icons.Store className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-[13px]" style={{ color: '#1e293b' }}>{store.name}</p>
              <p className="text-[11px]" style={{ color: '#64748b' }}>{store.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Icons.Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span className="font-semibold text-[13px]" style={{ color: '#1e293b' }}>{(store.overallRating ?? 0).toFixed(1)}</span>
          </div>
        </motion.div>
      ))}
      {stores.length === 0 && <div className="text-center py-8 text-[13px]" style={{ color: '#94a3b8' }}>No stores yet</div>}
    </div>
  </motion.div>
);
