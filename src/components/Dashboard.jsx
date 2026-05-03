import { useEffect, useMemo, useState } from 'react';
import { Activity, Database, RefreshCw, Settings, Trash2, TriangleAlert } from 'lucide-react';
import { getBinStatus, getHistory, getRegistry } from '../services/api';
import StatusCard from './StatusCard';
import AlertBox from './AlertBox';
import HistoryTable from './HistoryTable';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import SettingsModal from './SettingsModal';
import { useLanguage } from '../context/LanguageContext';

const MetricCard = ({ iconNode, label, value, tone = 'slate' }) => {
    const tones = {
        slate: 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200',
        cyan: 'border-cyan-200 bg-cyan-50 text-cyan-800 dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-200',
        rose: 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200',
        amber: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200',
    };

    return (
        <div className={`min-w-0 rounded-lg border p-4 shadow-sm ${tones[tone]}`}>
            <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{label}</span>
                {iconNode}
            </div>
            <div className="mt-2 text-2xl font-bold leading-none">{value}</div>
        </div>
    );
};

const Dashboard = () => {
    const { t } = useLanguage();
    const [binsStatus, setBinsStatus] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const fetchData = async () => {
        try {
            const registryData = await getRegistry();
            const historyRes = await getHistory();

            if (registryData && registryData.length > 0) {
                const statusPromises = registryData.map(async (bin) => {
                    try {
                        const status = await getBinStatus(bin.deviceid || bin.deviceId);
                        return {
                            ...status,
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

                setBinsStatus(await Promise.all(statusPromises));
            } else {
                setBinsStatus([]);
            }

            setHistory(Array.isArray(historyRes) ? historyRes : []);
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

    const metrics = useMemo(() => {
        const totalBins = binsStatus.length;
        const fullBins = binsStatus.filter(bin => bin.status === 'FULL' || (bin.fillPercentage || 0) > 80).length;
        const halfBins = binsStatus.filter(bin => bin.status === 'HALF').length;
        const averageFill = totalBins
            ? Math.round(binsStatus.reduce((sum, bin) => sum + Number(bin.fillPercentage || 0), 0) / totalBins)
            : 0;

        return { totalBins, fullBins, halfBins, averageFill };
    }, [binsStatus]);

    const isAnyFull = metrics.fullBins > 0;

    return (
        <div className="min-h-screen">
            <AlertBox isVisible={isAnyFull} />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
                <header className="rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:px-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase text-cyan-700 dark:text-cyan-300">IoT Monitoring Dashboard</p>
                            <h1 className="mt-1 text-2xl font-bold tracking-normal text-slate-950 dark:text-white sm:text-3xl">
                                {t('smart')} <span className="text-cyan-700 dark:text-cyan-300">{t('waste')}</span>
                            </h1>
                            <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">{t('subtitle')}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                            <div className="flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 sm:text-sm">
                                <RefreshCw className="h-4 w-4 animate-spin text-cyan-700 dark:text-cyan-300" style={{ animationDuration: '3s' }} />
                                <span className="whitespace-nowrap">{t('lastUpdated')}: {lastUpdated.toLocaleTimeString()}</span>
                            </div>
                            <LanguageToggle />
                            <button
                                onClick={() => setIsSettingsOpen(true)}
                                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                                title={t('settings')}
                            >
                                <Settings className="h-5 w-5" />
                            </button>
                            <ThemeToggle />
                        </div>
                    </div>
                </header>

                <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <MetricCard iconNode={<Trash2 className="h-4 w-4 shrink-0" />} label="Total bins" value={metrics.totalBins} tone="cyan" />
                    <MetricCard iconNode={<TriangleAlert className="h-4 w-4 shrink-0" />} label="Full bins" value={metrics.fullBins} tone={metrics.fullBins ? 'rose' : 'slate'} />
                    <MetricCard iconNode={<Activity className="h-4 w-4 shrink-0" />} label="Half bins" value={metrics.halfBins} tone="amber" />
                    <MetricCard iconNode={<Database className="h-4 w-4 shrink-0" />} label="Avg fill" value={`${metrics.averageFill}%`} tone="slate" />
                </section>

                <SettingsModal isOpen={isSettingsOpen} onClose={() => { setIsSettingsOpen(false); fetchData(); }} />

                <main className="grid min-h-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(320px,380px)_1fr]">
                    <section className="min-w-0">
                        {loading && binsStatus.length === 0 ? (
                            <div className="flex h-64 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-700 dark:border-slate-800 dark:border-t-cyan-300"></div>
                            </div>
                        ) : binsStatus.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
                                {binsStatus.map((bin, idx) => (
                                    <StatusCard key={`${bin.deviceId || bin.friendlyName || 'bin'}-${idx}`} data={bin} />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No Dustbins Found</h3>
                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Add a device in settings or wait for hardware data.</p>
                            </div>
                        )}
                    </section>

                    <section className="min-h-[520px] min-w-0">
                        <HistoryTable historyData={history} />
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
