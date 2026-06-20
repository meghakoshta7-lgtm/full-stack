import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useUserManagement } from '../hooks/useUserManagement';
import { UserTable } from '../components/UserTable';
import { FilterBar } from '../components/FilterBar';
import { UserFormDialog } from '../components/UserFormDialog';
import { UserRole } from '../../../types';
import { Icons } from '../../../components/common/Icons';
import { PageHeader } from '../../../components/shared/PageHeader';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { Toast } from '../../../components/shared/Toast';
import { ConfirmDialog } from '../../../components/shared/ConfirmDialog';
import { useToast } from '../../../hooks/useToast';

const UserManagement: React.FC = () => {
  const {
    users, loading, error, success, setError, setSuccess, dialogOpen, setDialogOpen, editingUser, formData, setFormData, order, orderBy, filters, setFilters, formErrors,
    deleteDialog, handleSort, handleSubmit, handleEdit, openDeleteDialog, confirmDelete, cancelDelete, openAddDialog
  } = useUserManagement();
  const { toasts, removeToast, showSuccess, showError } = useToast();

  useEffect(() => { if (error) { showError('Error', error); setError(''); } }, [error, showError, setError]);
  useEffect(() => { if (success) { showSuccess('Success', success); setSuccess(''); } }, [success, showSuccess, setSuccess]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Toast toasts={toasts} onRemove={removeToast} />
      <PageHeader title="Users" subtitle="Manage all registered users"
        action={{ label: 'Add User', icon: <Icons.Plus className="w-4 h-4" />, onClick: openAddDialog }} />

      <FilterBar fields={[
        { key: 'name', placeholder: 'Search by Name' },
        { key: 'email', placeholder: 'Search by Email' },
        { key: 'address', placeholder: 'Search by Address' },
        { key: 'role', placeholder: 'All Roles', type: 'select', options: [{ value: '', label: 'All Roles' }, ...Object.values(UserRole).map(r => ({ value: r, label: r.replace('_', ' ') }))] },
      ]} filters={filters} onChange={(f: any) => setFilters(f)} />

      <UserTable users={users} order={order} orderBy={orderBy} onSort={(f: any) => handleSort(f)} onEdit={handleEdit} onDelete={openDeleteDialog} />

      <AnimatePresence>
        {dialogOpen && (
          <UserFormDialog open={dialogOpen} editing={!!editingUser} formData={formData} errors={formErrors}
            onClose={() => setDialogOpen(false)} onChange={setFormData} onSubmit={handleSubmit} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteDialog.open && (
          <ConfirmDialog open={deleteDialog.open} title="Delete User" message="Are you sure you want to delete this user? This action cannot be undone."
            confirmLabel="Delete" type="danger" onConfirm={confirmDelete} onCancel={cancelDelete} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;
