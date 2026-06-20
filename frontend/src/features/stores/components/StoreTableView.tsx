import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store } from '../types';
import { Icons } from '../../../components/common/Icons';
import { StarRating } from '../../../components/shared/StarRating';
import { EmptyState } from '../../../components/shared/EmptyState';
import { AvatarInitials } from '../../../components/shared/AvatarInitials';

interface Props {
  stores: Store[]; order: 'asc' | 'desc'; orderBy: string;
  onSort: (field: 'name' | 'address' | 'overallRating') => void;
  onRate: (store: Store) => void;
}

export const StoreTableView: React.FC<Props> = ({ stores, order, orderBy, onSort, onRate }) => {
  const SortIcon = ({ field }: { field: string }) => {
    if (orderBy !== field) return <Icons.ArrowUpDown className="w-3 h-3" />;
    return order === 'asc' ? <Icons.ArrowUp className="w-3 h-3" /> : <Icons.ArrowDown className="w-3 h-3" />;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="hidden md:block overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {([
                { key: 'name', label: 'Store' },
                { key: 'address', label: 'Address' },
                { key: 'overallRating', label: 'Rating' },
              ] as const).map(({ key, label }) => (
                <th key={key} onClick={() => onSort(key)}
                  className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none hover:bg-purple-50 transition-colors"
                  style={{ color: '#94a3b8' }}>
                  <div className="flex items-center space-x-1">
                    <span>{label}</span>
                    <span style={{ color: '#cbd5e1' }}><SortIcon field={key} /></span>
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Your Rating</th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Action</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: '#f1f5f9' }}>
            <AnimatePresence>
              {stores.map((s, i) => (
                <motion.tr key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="hover:bg-purple-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <AvatarInitials name={s.name} size="md" />
                      <span className="font-semibold" style={{ color: '#1e293b' }}>{s.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate" style={{ color: '#64748b' }}>{s.address}</td>
                  <td className="px-6 py-4"><StarRating rating={s.overallRating ?? 0} size="sm" showValue /></td>
                  <td className="px-6 py-4">
                    {s.userRating ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                        style={{ background: '#f0eaf8', color: '#6366f1' }}>{s.userRating}/5</span>
                    ) : (
                      <span style={{ color: '#d1d5db' }}>&mdash;</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={() => onRate(s)}
                      className="w-9 h-9 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow mx-auto"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                      <Icons.Pencil className="w-4 h-4 text-white" />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {stores.length === 0 && <EmptyState icon={Icons.Store} title="No stores found" subtitle="Try adjusting your search criteria" />}
      </div>


      <div className="md:hidden max-h-[500px] overflow-y-auto">
        <AnimatePresence>
          {stores.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="p-4 border-b last:border-b-0 hover:bg-purple-50/30 transition-colors" style={{ borderColor: '#f1f5f9' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <AvatarInitials name={s.name} size="md" />
                  <div>
                    <p className="font-semibold text-[13px]" style={{ color: '#1e293b' }}>{s.name}</p>
                    <p className="text-[11px]" style={{ color: '#64748b' }}>{s.address}</p>
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => onRate(s)}
                  className="w-9 h-9 rounded-full flex items-center justify-center shadow-md"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                  <Icons.Pencil className="w-4 h-4 text-white" />
                </motion.button>
              </div>
              <div className="flex items-center justify-between">
                <StarRating rating={s.overallRating ?? 0} size="sm" showValue />
                {s.userRating ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium"
                    style={{ background: '#f0eaf8', color: '#6366f1' }}>{s.userRating}/5</span>
                ) : (
                  <span className="text-[12px]" style={{ color: '#d1d5db' }}>Not rated</span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {stores.length === 0 && <EmptyState icon={Icons.Store} title="No stores found" subtitle="Try adjusting your search criteria" />}
      </div>
    </motion.div>
  );
};
