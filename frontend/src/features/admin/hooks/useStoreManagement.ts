import { useState, useEffect } from 'react';
import { adminApi } from '../api/admin.api';
import { StoreFormData } from '../types';
import { User } from '../../../types';
import { validateStoreForm } from '../validation/admin.validation';

type SortField = 'name' | 'email' | 'address';

export function useStoreManagement() {
  const [stores, setStores] = useState<any[]>([]);
  const [owners, setOwners] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<any | null>(null);
  const [formData, setFormData] = useState<StoreFormData>({ name: '', email: '', address: '', ownerId: '' });
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<SortField>('name');
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });

  const fetchStores = async () => {
    try {
      const params: Record<string, string> = { sortBy: orderBy, sortOrder: order.toUpperCase() };
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      setStores((await adminApi.getStores(params)).stores);
    } catch (err: any) { setError(err.response?.data?.message || 'Failed'); }
  };

  const fetchOwners = async () => { try { setOwners(await adminApi.getStoreOwners()); } catch {} };

  useEffect(() => { fetchStores(); fetchOwners(); }, [order, orderBy, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSort = (field: SortField) => {
    const a = orderBy === field && order === 'asc';
    setOrder(a ? 'desc' : 'asc');
    setOrderBy(field);
  };

  const validate = (): boolean => {
    const e = validateStoreForm(formData.name, formData.email, formData.address, formData.ownerId, !!editingStore);
    setFormErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      if (editingStore) {
        await adminApi.updateStore(editingStore.id, { name: formData.name, email: formData.email, address: formData.address });
        setSuccess('Store updated successfully');
      } else {
        await adminApi.createStore(formData);
        setSuccess('Store created successfully');
      }
      setDialogOpen(false);
      setEditingStore(null);
      resetForm();
      fetchStores();
    } catch (err: any) { setError(err.response?.data?.message || 'Failed'); }
  };

  const handleEdit = (store: any) => {
    setEditingStore(store);
    setFormData({ name: store.name, email: store.email, address: store.address, ownerId: store.ownerId || '' });
    setDialogOpen(true);
  };

  const openDeleteDialog = (id: number) => { setDeleteDialog({ open: true, id }); };
  const confirmDelete = async () => {
    if (!deleteDialog.id) return;
    try { await adminApi.deleteStore(deleteDialog.id); setDeleteDialog({ open: false, id: null }); setSuccess('Store deleted successfully'); fetchStores(); }
    catch (err: any) { setError(err.response?.data?.message || 'Failed'); setDeleteDialog({ open: false, id: null }); }
  };
  const cancelDelete = () => setDeleteDialog({ open: false, id: null });

  const openAddDialog = () => { resetForm(); setEditingStore(null); setDialogOpen(true); };
  const resetForm = () => { setFormData({ name: '', email: '', address: '', ownerId: '' }); setFormErrors({}); };

  return {
    stores, owners, error, success, setError, setSuccess, dialogOpen, setDialogOpen, editingStore, formData, setFormData, order, orderBy, filters, setFilters, formErrors,
    deleteDialog, handleSort, handleSubmit, handleEdit, openDeleteDialog, confirmDelete, cancelDelete, openAddDialog
  };
}
