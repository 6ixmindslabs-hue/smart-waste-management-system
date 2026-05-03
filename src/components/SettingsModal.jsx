import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { getRegistry, addRegistry, updateRegistry, deleteRegistry } from '../services/api';

const SettingsModal = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const [bins, setBins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBin, setCurrentBin] = useState({ id: null, deviceId: '', name: '', details: '' });

    const fetchBins = async () => {
        setLoading(true);
        try {
            const data = await getRegistry();
            setBins(data);
        } catch (error) {
            console.error("Failed to fetch bins:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchBins();
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Check if we are editing an existing registered bin (has a valid database ID)
            // Note: 'temp-' IDs are null in currentBin.id due to mapping in handleEdit
            if (isEditing && currentBin.id) {
                await updateRegistry(currentBin);
            } else {
                // Determine whether we are "adding" a new bin manually OR
                // "registering" a discovered bin (which has id=null but might be coming from 'Edit' logic)
                // In both cases, we need to add a new registry entry.
                await addRegistry(currentBin);
            }
            // Reset form and refresh list
            setCurrentBin({ id: null, deviceId: '', name: '', details: '' });
            setIsEditing(false);
            await fetchBins();
        } catch (error) {
            alert('Error saving bin: ' + (error.response?.data?.error || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (bin) => {
        // If it's a discovered bin (starts with temp-), treat it as a new registration (id=null)
        // If it's a registered bin, keep the ID for updates
        const isUnregistered = bin.id && bin.id.toString().startsWith('temp-');

        setCurrentBin({
            id: isUnregistered ? null : bin.id,
            deviceId: bin.deviceid || bin.deviceId || '', // Handle potentially disparate naming
            name: bin.name || '',
            details: bin.details || ''
        });
        setIsEditing(true);
    };

    const handleDelete = async (binId, binName) => {
        const isTemp = binId && binId.toString().startsWith('temp-');
        const confirmMsg = isTemp
            ? `Are you sure you want to PERMANENTLY DELETE all history data for "${binName}"? This cannot be undone.`
            : `Are you sure you want to Unregister "${binName}"? The device will revert to a "Discovered" state if it has existing data.`;

        if (window.confirm(confirmMsg)) {
            setDeletingId(binId);
            try {
                await deleteRegistry(binId);
                await fetchBins();
            } catch (error) {
                alert('Error deleting bin: ' + (error.response?.data?.error || error.message));
            } finally {
                setDeletingId(null);
            }
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentBin({ id: null, deviceId: '', name: '', details: '' });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                {t('settings')}
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                                <X className="w-5 h-5 md:w-6 md:h-6 text-slate-400" />
                            </button>
                        </div>

                        <div className="p-4 md:p-6 overflow-y-auto">
                            {/* Form */}
                            <form onSubmit={handleSubmit} className="mb-6 md:mb-8 p-4 md:p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                                <h3 className="text-base md:text-lg font-bold text-indigo-900 dark:text-indigo-300 mb-4 flex items-center gap-2">
                                    {isEditing ? <Edit2 size={16} className="md:w-[18px] md:h-[18px]" /> : <Plus size={16} className="md:w-[18px] md:h-[18px]" />}
                                    {isEditing ? (currentBin.id ? t('editBin') : 'Register Discovered Bin') : t('addBin')}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">{t('binName')}</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Main Lobby Bin"
                                            className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm md:text-base"
                                            value={currentBin.name}
                                            onChange={(e) => setCurrentBin({ ...currentBin, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">{t('deviceIdLabel')}</label>
                                        <input
                                            type="text"
                                            required
                                            disabled={isEditing}
                                            placeholder="BIN001"
                                            className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                                            value={currentBin.deviceId}
                                            onChange={(e) => setCurrentBin({ ...currentBin, deviceId: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-1">
                                        <label className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">{t('binDetails')}</label>
                                        <input
                                            type="text"
                                            placeholder="Floor 1, West Wing"
                                            className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm md:text-base"
                                            value={currentBin.details}
                                            onChange={(e) => setCurrentBin({ ...currentBin, details: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-end gap-3">
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="px-4 md:px-6 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-all text-sm md:text-base"
                                            disabled={submitting}
                                        >
                                            {t('cancel')}
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-4 md:px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-100 dark:shadow-none flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-wait text-sm md:text-base"
                                    >
                                        <Save size={16} className="md:w-[18px] md:h-[18px]" />
                                        {submitting ? 'Saving...' : t('save')}
                                    </button>
                                </div>
                            </form>

                            {/* List */}
                            <div className="space-y-3">
                                <h3 className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t('allBins')}</h3>
                                {loading ? (
                                    <div className="py-10 text-center animate-pulse text-slate-400 text-sm">{t('loading')}...</div>
                                ) : bins.length === 0 ? (
                                    <div className="py-10 text-center text-slate-400 bg-slate-50 dark:bg-slate-900/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-sm">
                                        {t('noBins')}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3">
                                        {Array.isArray(bins) && bins.map(bin => {
                                            const isTemp = bin.id && bin.id.toString().startsWith('temp-');
                                            return (
                                                <div key={bin.id} className="p-3 md:p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between group hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all shadow-sm">
                                                    <div className="min-w-0 pr-2">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h4 className="font-bold text-slate-800 dark:text-white truncate max-w-[150px] md:max-w-xs text-sm md:text-base">{bin.name}</h4>
                                                            {isTemp && (
                                                                <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">Discovered</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                                            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono uppercase tracking-wider shrink-0">{bin.deviceid || bin.deviceId}</span>
                                                            {bin.details && <span className="truncate hidden sm:inline">• {bin.details}</span>}
                                                        </div>
                                                        {bin.details && <div className="text-xs text-slate-500 sm:hidden truncate mt-0.5">{bin.details}</div>}
                                                    </div>
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        <button
                                                            onClick={() => handleEdit(bin)}
                                                            className="p-1.5 md:p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={16} className="md:w-[18px] md:h-[18px]" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(bin.id, bin.name)}
                                                            className="p-1.5 md:p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all disabled:opacity-50"
                                                            disabled={deletingId === bin.id}
                                                            title="Delete"
                                                        >
                                                            {deletingId === bin.id ? (
                                                                <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                                                            ) : (
                                                                <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SettingsModal;
