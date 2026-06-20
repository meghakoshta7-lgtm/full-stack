import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../../../components/common/Icons';
import { StarRating } from '../../../components/shared/StarRating';
import { AvatarInitials } from '../../../components/shared/AvatarInitials';
import { EmptyState } from '../../../components/shared/EmptyState';

interface Rating {
  id: number; rating: number; createdAt: string;
  user: { name: string; email: string };
}

interface Props {
  ratings: Rating[]; totalRatings: number;
  sortField: 'rating' | 'date'; sortDir: 'asc' | 'desc';
  onSort: (field: 'rating' | 'date') => void;
}

export const RatingsTable: React.FC<Props> = ({ ratings, totalRatings, sortField, sortDir, onSort }) => {
  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <Icons.ArrowUpDown className="w-3 h-3" />;
    return sortDir === 'asc' ? <Icons.ArrowUp className="w-3 h-3" /> : <Icons.ArrowDown className="w-3 h-3" />;
  };

  return (
    <div className="card overflow-hidden">
      <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between">
        <h2 className="text-lg font-display font-semibold text-surface-800 flex items-center space-x-2">
          <Icons.MessageSquare className="w-5 h-5 text-primary-500" /><span>Customer Ratings</span>
        </h2>
        <span className="badge bg-primary-50 text-primary-700">{totalRatings} total</span>
      </div>
      {ratings.length === 0 ? (
        <EmptyState icon={Icons.FileText} title="No ratings yet" subtitle="Customer ratings will appear here" />
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto max-h-[420px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-50">
                <tr>
                  <th className="table-header">Customer</th>
                  <th className="table-header">Email</th>
                  <th className="table-header cursor-pointer select-none hover:bg-surface-100/50 transition-colors" onClick={() => onSort('rating')}>
                    <div className="flex items-center space-x-1"><span>Rating</span><span className="text-surface-300"><SortIcon field="rating" /></span></div>
                  </th>
                  <th className="table-header cursor-pointer select-none hover:bg-surface-100/50 transition-colors" onClick={() => onSort('date')}>
                    <div className="flex items-center space-x-1"><span>Date</span><span className="text-surface-300"><SortIcon field="date" /></span></div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                <AnimatePresence>
                  {ratings.map((r, i) => (
                    <motion.tr key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                      className="hover:bg-primary-50/30 transition-colors">
                      <td className="table-cell">
                        <div className="flex items-center space-x-2">
                          <AvatarInitials name={r.user.name} size="sm" />
                          <span className="font-medium text-surface-800">{r.user.name}</span>
                        </div>
                      </td>
                      <td className="table-cell text-surface-500">{r.user.email}</td>
                      <td className="table-cell"><StarRating rating={r.rating} size="sm" showValue /></td>
                      <td className="table-cell text-surface-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

    
          <div className="md:hidden max-h-[420px] overflow-y-auto">
            <AnimatePresence>
              {ratings.map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="p-4 border-b last:border-b-0 hover:bg-primary-50/30 transition-colors" style={{ borderColor: '#f1f5f9' }}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <AvatarInitials name={r.user.name} size="sm" />
                      <div>
                        <p className="font-medium text-[13px] text-surface-800">{r.user.name}</p>
                        <p className="text-[11px] text-surface-500">{r.user.email}</p>
                      </div>
                    </div>
                    <StarRating rating={r.rating} size="sm" showValue />
                  </div>
                  <p className="text-[11px] text-surface-400 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};
