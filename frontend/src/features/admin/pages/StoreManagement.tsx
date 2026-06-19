import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useStoreManagement } from '../hooks/useStoreManagement';
import { StoreTable } from '../components/StoreTable';
import { FilterBar } from '../components/FilterBar';
import { StoreFormDialog } from '../components/StoreFormDialog';
import { Icons } from '../../../components/common/Icons';
import { PageHeader } from '../../../components/shared/PageHeader';
import { Toast } from '../../../components/shared/Toast';
import { ConfirmDialog } from '../../../components/shared/ConfirmDialog';
import { useToast } from '../../../hooks/useToast';

const StoreManagement: React.FC = () => {
  const {
    stores, owners, error, success, setError, setSuccess, dialogOpen, setDialogOpen, editingStore, formData, setFormData, order, orderBy, filters, setFilters, formErrors,
    deleteDialog, handleSort, handleSubmit, handleEdit, openDeleteDialog, confirmDelete, cancelDelete, openAddDialog
  } = useStoreManagement();
  const { toasts, removeToast, showSuccess, showError } = useToast();

  useEffect(() => { if (error) { showError('Error', error); setError(''); } }, [error, showError, setError]);
  useEffect(() => { if (success) { showSuccess('Success', success); setSuccess(''); } }, [success, showSuccess, setSuccess]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Toast toasts={toasts} onRemove={removeToast} />
      <PageHeader title="Stores" subtitle="Manage all registered stores"
        action={{ label: 'Add Store', icon: <Icons.Plus className="w-4 h-4" />, onClick: openAddDialog }} />

      <FilterBar fields={[
        { key: 'name', placeholder: 'Search by Name' },
        { key: 'address', placeholder: 'Search by Address' },
      ]} filters={filters} onChange={(f: any) => setFilters(f)} />

      <StoreTable stores={stores} order={order} orderBy={orderBy} onSort={(f: any) => handleSort(f)} onEdit={handleEdit} onDelete={openDeleteDialog} />

      <AnimatePresence>
        {dialogOpen && <StoreFormDialog open={dialogOpen} editing={!!editingStore} formData={formData} errors={formErrors} owners={owners}
          onClose={() => setDialogOpen(false)} onChange={setFormData} onSubmit={handleSubmit} />}
      </AnimatePresence>

      <AnimatePresence>
        {deleteDialog.open && (
          <ConfirmDialog open={deleteDialog.open} title="Delete Store" message="Are you sure you want to delete this store? This action cannot be undone."
            confirmLabel="Delete" type="danger" onConfirm={confirmDelete} onCancel={cancelDelete} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoreManagement;
