import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { StatCards } from '../components/StatCards';
import { RecentUsersTable } from '../components/RecentUsersTable';
import { RecentStoresTable } from '../components/RecentStoresTable';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { Toast } from '../../../components/shared/Toast';
import { useToast } from '../../../hooks/useToast';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { stats, recentUsers, recentStores, loading, error } = useAdminDashboard();
  const { toasts, removeToast, showError } = useToast();

  useEffect(() => { if (error) showError('Error', error); }, [error, showError]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Toast toasts={toasts} onRemove={removeToast} />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-[32px] font-bold" style={{ color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>Admin Dashboard</h1>
          <p className="text-[14px] mt-0.5" style={{ color: '#64748b' }}>Platform overview and management</p>
        </div>
        <div className="hidden md:block flex-shrink-0">
          <img src="/assets/dashboard-illustration.png" alt="Dashboard" className="h-[180px] w-auto object-contain" />
        </div>
      </motion.div>

      <StatCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentUsersTable users={recentUsers} onManage={() => navigate('/admin/users')} />
        <RecentStoresTable stores={recentStores} onManage={() => navigate('/admin/stores')} />
      </div>
    </div>
  );
};

export default AdminDashboard;
