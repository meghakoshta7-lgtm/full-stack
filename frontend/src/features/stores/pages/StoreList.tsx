import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoreList } from '../hooks/useStoreList';
import { StoreSearchBar } from '../components/StoreSearchBar';
import { ViewToggle } from '../components/ViewToggle';
import { StoreCardGrid } from '../components/StoreCardGrid';
import { StoreTableView } from '../components/StoreTableView';
import { RatingDialog } from '../components/RatingDialog';
import { Toast } from '../../../components/shared/Toast';
import { useToast } from '../../../hooks/useToast';

const StoreList: React.FC = () => {
  const {
    stores, error, setError, order, orderBy, search, setSearch, dialog, setDialog, selectedRating, setSelectedRating, viewMode, setViewMode,
    handleRateStore, handleSubmitRating, handleSort
  } = useStoreList();
  const { toasts, removeToast, showError } = useToast();

  useEffect(() => { if (error) { showError('Error', error); setError(''); } }, [error]);

  return (
    <div className="min-h-screen" style={{ background: '#f0eaf8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Toast toasts={toasts} onRemove={removeToast} />
        <div className="flex items-center justify-between mb-4 relative">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex-shrink-0 z-10">
            <h1 className="text-[26px] font-bold" style={{ color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>Store Listings</h1>
            <p className="text-[13px] mt-0.5" style={{ color: '#64748b' }}>Browse and rate stores</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="absolute left-1/2 -translate-x-1/2 -top-2">
            <img src="/assets/store-illustration.png" alt="Store" className="h-[200px] w-auto object-contain" />
          </motion.div>
          <ViewToggle viewMode={viewMode} onChange={setViewMode} />
        </div>

        <StoreSearchBar search={search} onChange={setSearch} />

        {viewMode === 'cards' ? (
          <StoreCardGrid stores={stores} onRate={handleRateStore} />
        ) : (
          <StoreTableView stores={stores} order={order} orderBy={orderBy} onSort={handleSort} onRate={handleRateStore} />
        )}

        <AnimatePresence>
          {dialog.open && <RatingDialog open={dialog.open} store={dialog.store} selectedRating={selectedRating}
            onClose={() => setDialog({ open: false, store: null })} onRatingChange={setSelectedRating} onSubmit={handleSubmitRating} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StoreList;
