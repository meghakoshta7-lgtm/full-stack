import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SortableHeader } from '../../../components/shared/SortableHeader';
import { RowActions } from '../../../components/shared/RowActions';
import { EmptyState } from '../../../components/shared/EmptyState';
import { Icons } from '../../../components/common/Icons';
import { AvatarInitials } from '../../../components/shared/AvatarInitials';

interface Props {
  stores: any[]; order: 'asc' | 'desc'; orderBy: string;
  onSort: (field: string) => void; onEdit: (store: any) => void; onDelete: (id: number) => void;
}

export const StoreTable: React.FC<Props> = ({ stores, order, orderBy, onSort, onEdit, onDelete }) => (
  <div className="card overflow-hidden">
    <div className="hidden md:block overflow-x-auto max-h-[420px] overflow-y-auto">
      <table className="w-full text-sm">
        <thead className="bg-surface-50">
          <tr>
            <th className="table-header w-10"><Icons.List className="w-3.5 h-3.5" /></th>
            <SortableHeader label="Name" field="name" currentField={orderBy} direction={order} onSort={onSort} />
            <SortableHeader label="Email" field="email" currentField={orderBy} direction={order} onSort={onSort} />
            <SortableHeader label="Address" field="address" currentField={orderBy} direction={order} onSort={onSort} />
            <th className="table-header">Rating</th>
            <th className="table-header text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-100">
          <AnimatePresence>
            {stores.map((s, i) => (
              <motion.tr key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="hover:bg-primary-50/30 transition-colors group">
                <td className="table-cell">
                  <AvatarInitials name={s.name} size="sm" />
                </td>
                <td className="table-cell font-medium text-surface-800">{s.name}</td>
                <td className="table-cell text-surface-500">{s.email}</td>
                <td className="table-cell text-surface-500 max-w-xs truncate">{s.address}</td>
                <td className="table-cell">
                  <div className="flex items-center space-x-1.5">
                    <Icons.Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-surface-700">{(s.overallRating ?? 0).toFixed(1)}</span>
                  </div>
                </td>
                <td className="table-cell text-right">
                  <RowActions onEdit={() => onEdit(s)} onDelete={() => onDelete(s.id)} />
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
      {stores.length === 0 && <EmptyState icon={Icons.Store} title="No stores found" />}
    </div>



    <div className="md:hidden max-h-[420px] overflow-y-auto">
      <AnimatePresence>
        {stores.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="p-4 border-b last:border-b-0 hover:bg-primary-50/30 transition-colors" style={{ borderColor: '#f1f5f9' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <AvatarInitials name={s.name} size="sm" />
                <div>
                  <p className="font-semibold text-[13px]" style={{ color: '#1e293b' }}>{s.name}</p>
                  <p className="text-[11px]" style={{ color: '#64748b' }}>{s.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Icons.Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold text-[13px]" style={{ color: '#1e293b' }}>{(s.overallRating ?? 0).toFixed(1)}</span>
              </div>
            </div>
            <p className="text-[11px] mb-2" style={{ color: '#94a3b8' }}>{s.address}</p>
            <div className="flex justify-end">
              <RowActions onEdit={() => onEdit(s)} onDelete={() => onDelete(s.id)} />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {stores.length === 0 && <EmptyState icon={Icons.Store} title="No stores found" />}
    </div>
  </div>
);
