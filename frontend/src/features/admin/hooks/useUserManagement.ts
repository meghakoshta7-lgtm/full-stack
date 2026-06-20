import { useState, useEffect } from 'react';
import { adminApi } from '../api/admin.api';
import { UserFormData } from '../types';
import { User, UserRole } from '../../../types';
import { validateUserForm } from '../validation/admin.validation';

type SortField = 'name' | 'email' | 'address' | 'role';

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({ name: '', email: '', password: '', address: '', role: UserRole.USER });
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<SortField>('name');
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = { sortBy: orderBy, sortOrder: order.toUpperCase() };
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      setUsers((await adminApi.getUsers(params)).users);
    } catch (err: any) { setError(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [order, orderBy, filters]);

  const handleSort = (field: SortField) => {
    const a = orderBy === field && order === 'asc';
    setOrder(a ? 'desc' : 'asc');
    setOrderBy(field);
  };

  const validate = (): boolean => {
    const e = validateUserForm(formData.name, formData.email, formData.password, formData.address, !!editingUser);
    setFormErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      if (editingUser) {
        await adminApi.updateUser(editingUser.id, { name: formData.name, email: formData.email, address: formData.address, role: formData.role });
        setSuccess('User updated successfully');
      } else {
        await adminApi.createUser(formData);
        setSuccess('User created successfully');
      }
      setDialogOpen(false);
      setEditingUser(null);
      resetForm();
      fetchUsers();
    } catch (err: any) { setError(err.response?.data?.message || 'Failed'); }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: '', address: user.address, role: user.role });
    setDialogOpen(true);
  };

  const openDeleteDialog = (id: number) => { setDeleteDialog({ open: true, id }); };
  const confirmDelete = async () => {
    if (!deleteDialog.id) return;
    try { await adminApi.deleteUser(deleteDialog.id); setDeleteDialog({ open: false, id: null }); setSuccess('User deleted successfully'); fetchUsers(); }
    catch (err: any) { setError(err.response?.data?.message || 'Failed'); setDeleteDialog({ open: false, id: null }); }
  };
  const cancelDelete = () => setDeleteDialog({ open: false, id: null });

  const openAddDialog = () => { resetForm(); setEditingUser(null); setDialogOpen(true); };
  const resetForm = () => { setFormData({ name: '', email: '', password: '', address: '', role: UserRole.USER }); setFormErrors({}); };

  return {
    users, loading, error, success, setError, setSuccess, dialogOpen, setDialogOpen, editingUser, formData, setFormData, order, orderBy, filters, setFilters, formErrors,
    deleteDialog, handleSort, handleSubmit, handleEdit, openDeleteDialog, confirmDelete, cancelDelete, openAddDialog
  };
}
