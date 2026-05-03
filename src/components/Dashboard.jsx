import React, { useState, useEffect } from 'react';
import { getBinStatus, getHistory, getRegistry } from '../services/api';
import StatusCard from './StatusCard';
import AlertBox from './AlertBox';
import HistoryTable from './HistoryTable';
import { RefreshCw, Settings } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import SettingsModal from './SettingsModal';
import { useLanguage } from '../context/LanguageContext';

const Dashboard = () => {
    const { t } = useLanguage();
    // statusData is now an array of bin statuses
    const [binsStatus, setBinsStatus] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const fetchData = async () => {
        try {
            // 1. Get all known bins (registered + discovered) from registry list
            const registryData = await getRegistry();

            // 2. Fetch history
            const historyRes = await getHistory();

            // 3. For each bin in registry, get its latest status
            // If the registry list is empty, we might still want to show something?
            // But getRegistry() returns both registered and discovered temp bins, so it covers everything.

            if (registryData && registryData.length > 0) {
                // Fetch status for each bin in parallel
                /* 
                   OPTIMIZATION NOTE: 
                   Ideally, we should have a bulk status API endpoint like /api/bin/list_status 
                   instead of calling /api/bin/status?deviceId=... N times.
                   For now, we map over them.
                */
                const statusPromises = registryData.map(async (bin) => {
                    // Use the device ID to fetch specific status
                    // Note: getBinStatus needs to handle receiving a deviceId now.
                    // We'll update getBinStatus in api.js to accept an argument.
                    // But first, let's see if the API supports it. 
                    // The backend /api/bin/status.js DOES support ?deviceId=...
                    // So we update the frontend service wrapper.
                    try {
                        const status = await getBinStatus(bin.deviceid || bin.deviceId);
                        return {
                            ...status,
                            // Ensure we use the friendly name from registry if available
                            friendlyName: bin.name,
                            details: bin.details
                        };
                    } catch {
                        return {
                            deviceId: bin.deviceid,
                            friendlyName: bin.name,
                            status: 'UNKNOWN',
                            fillPercentage: 0
                        };
                    }
                });

                const allStatuses = await Promise.all(statusPromises);
                setBinsStatus(allStatuses);
            } else {
                setBinsStatus([]);
            }

            if (historyRes && Array.isArray(historyRes)) {
                setHistory(historyRes);
            } else {
                setHistory([]);
            }
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Error fetching dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    // Check if ANY bin is full for the global alert
    const isAnyFull = binsStatus.some(bin => bin.status === 'FULL' || (bin.fillPercentage || 0) > 80);

    return (
        <div className="min-h-screen w-full flex flex-col relative z-10 p-4 md:p-6 lg:p-8 text-slate-800 dark:text-slate-100 transition-colors duration-300">
            <AlertBox isVisible={isAnyFull} />

            <header className="flex-none flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-800 dark:text-white">
                        {t('smart')}<span className="text-indigo-600 dark:text-indigo-400">{t('waste')}</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm md:text-base">{t('subtitle')}</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs md:text-sm bg-white dark:bg-slate-800 px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-sm border border-slate-100 dark:border-slate-700">
                        <RefreshCw className="w-3 h-3 md:w-4 md:h-4 animate-spin" style={{ animationDuration: '3s' }} />
                        <span>{t('lastUpdated')}: {lastUpdated.toLocaleTimeString()}</span>
                    </div>
                    <LanguageToggle />
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="p-1.5 md:p-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                        title={t('settings')}
                    >
                        <Settings className="w-4 h-4 md:w-5 md:h-5 " />
                    </button>
                    <ThemeToggle />
                </div>
            </header>

            <SettingsModal isOpen={isSettingsOpen} onClose={() => { setIsSettingsOpen(false); fetchData(); }} />

            <main className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6 lg:gap-8 pb-2">
                {/* Left Column: Grid of Bins */}
                <div className="lg:w-1/3 xl:w-1/4 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">

                    {loading && binsStatus.length === 0 ? (
                        <div className="bg-white dark:bg-slate-800 h-64 w-full rounded-3xl shadow-xl p-8 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-400"></div>
                        </div>
                    ) : binsStatus.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                            {binsStatus.map((bin, idx) => (
                                <StatusCard key={idx} data={bin} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 border border-slate-100 dark:border-slate-700 text-center">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No Dustbins Found</h3>
                            <p className="text-slate-500 text-sm">Add a device in settings or wait for data.</p>
                        </div>
                    )}
                </div>

                {/* Right Column: History Table */}
                <div className="flex-1 h-[500px] lg:h-auto flex flex-col overflow-hidden">
                    <HistoryTable historyData={history} />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
