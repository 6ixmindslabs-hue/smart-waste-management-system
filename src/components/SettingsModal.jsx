import { useEffect, useState } from 'react';
import { Edit2, Plus, Save, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { addRegistry, deleteRegistry, getRegistry, updateRegistry } from '../services/api';

const fieldClass = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white md:px-4 md:py-2.5";

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
            setBins(await getRegistry());
        } catch (error) {
            console.error("Failed to fetch bins:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) fetchBins();
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (isEditing && currentBin.id) {
                await updateRegistry(currentBin);
            } else {
                await addRegistry(currentBin);
            }
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
        const isUnregistered = bin.id && bin.id.toString().startsWith('temp-');
        setCurrentBin({
            id: isUnregistered ? null : bin.id,
            deviceId: bin.deviceid || bin.deviceId || '',
            name: bin.name || '',
            details: bin.details || ''
        });
        setIsEditing(true);
    };

    const handleDelete = async (binId, binName) => {
        const isTemp = binId && binId.toString().startsWith('temp-');
        const confirmMsg = isTemp
            ? `Are you sure you want to permanently delete all history data for "${binName}"? This cannot be undone.`
            : `Are you sure you want to unregister "${binName}"? Existing data will remain in history.`;

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
                <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, y: 16 }}
                        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-lg bg-white shadow-2xl dark:bg-slate-900 sm:max-h-[90vh] sm:rounded-lg"
                    >
                        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/70 sm:p-4 md:p-5">
                            <h2 className="text-lg font-bold text-slate-950 dark:text-white md:text-xl">{t('settings')}</h2>
                            <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-200/70 dark:hover:bg-slate-800" title="Close">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-3 sm:p-4 md:p-5">
                            <form onSubmit={handleSubmit} className="mb-5 rounded-lg border border-cyan-200 bg-cyan-50/70 p-3 dark:border-cyan-900/60 dark:bg-cyan-950/20 sm:p-4 md:p-5">
                                <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-cyan-900 dark:text-cyan-200">
                                    {isEditing ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                    {isEditing ? (currentBin.id ? t('editBin') : 'Register Discovered Bin') : t('addBin')}
                                </h3>

                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <label className="ml-1 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{t('binName')}</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Main Lobby Bin"
                                            className={fieldClass}
                                            value={currentBin.name}
                                            onChange={(e) => setCurrentBin({ ...currentBin, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="ml-1 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{t('deviceIdLabel')}</label>
                                        <input
                                            type="text"
                                            required
                                            disabled={isEditing}
                                            placeholder="BIN001"
                                            className={fieldClass}
                                            value={currentBin.deviceId}
                                            onChange={(e) => setCurrentBin({ ...currentBin, deviceId: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="ml-1 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{t('binDetails')}</label>
                                        <input
                                            type="text"
                                            placeholder="Floor 1, West Wing"
                                            className={fieldClass}
                                            value={currentBin.details}
                                            onChange={(e) => setCurrentBin({ ...currentBin, details: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:justify-end">
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="rounded-lg px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 sm:py-2"
                                            disabled={submitting}
                                        >
                                            {t('cancel')}
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex items-center justify-center gap-2 rounded-lg bg-cyan-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-800 disabled:cursor-wait disabled:opacity-70 dark:bg-cyan-600 dark:hover:bg-cyan-500 sm:py-2"
                                    >
                                        <Save className="h-4 w-4" />
                                        {submitting ? 'Saving...' : t('save')}
                                    </button>
                                </div>
                            </form>

                            <div className="space-y-3">
                                <h3 className="ml-1 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{t('allBins')}</h3>
                                {loading ? (
                                    <div className="py-10 text-center text-sm text-slate-400">{t('loading')}...</div>
                                ) : bins.length === 0 ? (
                                    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 py-10 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-950/40">
                                        {t('noBins')}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3">
                                        {Array.isArray(bins) && bins.map(bin => {
                                            const isTemp = bin.id && bin.id.toString().startsWith('temp-');
                                            return (
                                                <div key={bin.id} className="group flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-cyan-200 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-cyan-900/60 md:p-4">
                                                    <div className="min-w-0 pr-2">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <h4 className="max-w-[160px] truncate text-sm font-bold text-slate-900 dark:text-white md:max-w-xs md:text-base">{bin.name}</h4>
                                                            {isTemp && (
                                                                <span className="whitespace-nowrap rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">Discovered</span>
                                                            )}
                                                        </div>
                                                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                                                            <span className="shrink-0 rounded bg-slate-100 px-2 py-0.5 font-mono uppercase tracking-wider dark:bg-slate-800 dark:text-slate-300">{bin.deviceid || bin.deviceId}</span>
                                                            {bin.details && <span className="hidden truncate sm:inline">- {bin.details}</span>}
                                                        </div>
                                                        {bin.details && <div className="mt-1 truncate text-xs text-slate-500 sm:hidden">{bin.details}</div>}
                                                    </div>
                                                    <div className="flex shrink-0 items-center gap-1">
                                                        <button
                                                            onClick={() => handleEdit(bin)}
                                                            className="rounded-lg p-2 text-cyan-700 transition hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-950/40"
                                                            title="Edit"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(bin.id, bin.name)}
                                                            className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50 disabled:opacity-50 dark:hover:bg-rose-950/40"
                                                            disabled={deletingId === bin.id}
                                                            title="Delete"
                                                        >
                                                            {deletingId === bin.id ? (
                                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-rose-600 border-t-transparent" />
                                                            ) : (
                                                                <Trash2 className="h-4 w-4" />
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
