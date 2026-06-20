import { useState, useEffect } from 'react';
import { storesApi } from '../api/stores.api';
import { ratingsApi } from '../api/ratings.api';
import { Store } from '../types';

export function useStoreList() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<'name' | 'address' | 'overallRating'>('name');
  const [search, setSearch] = useState({ name: '', address: '' });
  const [dialog, setDialog] = useState<{ open: boolean; store: Store | null }>({ open: false, store: null });
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

  const fetchStores = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = { sortBy: orderBy, sortOrder: order.toUpperCase() };
      if (search.name) params.name = search.name;
      if (search.address) params.address = search.address;
      setStores((await storesApi.getAll(params)).stores);
    } catch (err: any) { setError(err.response?.data?.message || 'Failed to load stores'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStores(); }, [order, orderBy]);

  useEffect(() => {
    const timer = setTimeout(() => { fetchStores(); }, 300);
    return () => clearTimeout(timer);
  }, [search.name, search.address]);

  const handleRateStore = (s: Store) => { setDialog({ open: true, store: s }); setSelectedRating(s.userRating); };
  const handleSubmitRating = async () => {
    if (!dialog.store || !selectedRating) return;
    try {
      if (dialog.store.userRating) await ratingsApi.update(dialog.store.id, selectedRating);
      else await ratingsApi.submit(dialog.store.id, selectedRating);
      setDialog({ open: false, store: null }); setSelectedRating(null); fetchStores();
    } catch (err: any) { setError(err.response?.data?.message || 'Failed to submit rating'); }
  };

  const handleSort = (field: 'name' | 'address' | 'overallRating') => {
    const a = orderBy === field && order === 'asc';
    setOrder(a ? 'desc' : 'asc');
    setOrderBy(field);
  };

  return {
    stores, loading, error, setError, order, orderBy, search, setSearch, dialog, setDialog, selectedRating, setSelectedRating, viewMode, setViewMode,
    handleRateStore, handleSubmitRating, handleSort
  };
}
