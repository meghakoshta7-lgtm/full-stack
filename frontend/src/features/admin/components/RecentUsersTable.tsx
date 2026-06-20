import React from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../../../components/common/Icons';
import { AvatarInitials } from '../../../components/shared/AvatarInitials';
import { RoleBadge } from '../../../components/shared/RoleBadge';

interface Props { users: any[]; onManage: () => void }

export const RecentUsersTable: React.FC<Props> = ({ users, onManage }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
    className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: '#f1f5f9' }}>
    <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#f1f5f9' }}>
      <h2 className="text-[15px] font-semibold flex items-center space-x-2" style={{ color: '#1e293b' }}>
        <Icons.Users className="w-[18px] h-[18px]" style={{ color: '#6366f1' }} /><span>Recent Users</span>
      </h2>
      <button onClick={onManage} className="text-[13px] font-semibold flex items-center space-x-1 hover:underline" style={{ color: '#6366f1' }}>
        <span>Manage Users</span><Icons.ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
    <div className="hidden md:block overflow-x-auto max-h-[320px] overflow-y-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Name</th>
            <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Email</th>
            <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Role</th>
          </tr>
        </thead>
        <tbody className="divide-y" style={{ borderColor: '#f1f5f9' }}>
          {users.map((user: any, i: number) => (
            <motion.tr key={user.id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
              className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-3">
                <div className="flex items-center space-x-3">
                  <AvatarInitials name={user.name} size="sm" />
                  <span className="font-medium" style={{ color: '#1e293b' }}>{user.name}</span>
                </div>
              </td>
              <td className="px-6 py-3" style={{ color: '#64748b' }}>{user.email}</td>
              <td className="px-6 py-3"><RoleBadge role={user.role} /></td>
            </motion.tr>
          ))}
          {users.length === 0 && <tr><td colSpan={3} className="text-center py-8" style={{ color: '#94a3b8' }}>No users yet</td></tr>}
        </tbody>
      </table>
    </div>


    <div className="md:hidden max-h-[320px] overflow-y-auto">
      {users.map((user: any, i: number) => (
        <motion.div key={user.id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
          className="px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors flex items-center justify-between" style={{ borderColor: '#f1f5f9' }}>
          <div className="flex items-center space-x-3">
            <AvatarInitials name={user.name} size="sm" />
            <div>
              <p className="font-medium text-[13px]" style={{ color: '#1e293b' }}>{user.name}</p>
              <p className="text-[11px]" style={{ color: '#64748b' }}>{user.email}</p>
            </div>
          </div>
          <RoleBadge role={user.role} />
        </motion.div>
      ))}
      {users.length === 0 && <div className="text-center py-8 text-[13px]" style={{ color: '#94a3b8' }}>No users yet</div>}
    </div>
  </motion.div>
);
