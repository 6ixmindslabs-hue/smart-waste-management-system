import { Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const HistoryTable = ({ historyData }) => {
    const { t } = useLanguage();

    const getStatusText = (status) => {
        if (status === 'EMPTY') return t('empty');
        if (status === 'HALF') return t('half');
        if (status === 'FULL') return t('full');
        return status;
    };

    const getStatusClass = (status) => {
        if (status === 'FULL') return 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300';
        if (status === 'HALF') return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300';
        return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300';
    };

    const getBarClass = (status) => {
        if (status === 'FULL') return 'bg-rose-500';
        if (status === 'HALF') return 'bg-amber-500';
        return 'bg-emerald-500';
    };

    return (
        <div className="flex h-full min-h-[520px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-2 border-b border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/70 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="flex items-center gap-2 text-base font-bold text-slate-950 dark:text-white">
                    <Clock className="h-5 w-5 text-cyan-700 dark:text-cyan-300" />
                    {t('recentActivity')}
                </h3>
                <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{t('lastRecords')}</span>
            </div>

            <div className="flex-1 overflow-auto">
                <table className="w-full min-w-[620px] border-collapse text-left">
                    <thead className="sticky top-0 z-10 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                        <tr>
                            <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{t('time')}</th>
                            <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{t('device')}</th>
                            <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{t('fillLevel')}</th>
                            <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{t('status')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {Array.isArray(historyData) && historyData.map((record, index) => {
                            const date = new Date(record.createdAt);
                            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                            const dateStr = date.toLocaleDateString();
                            const fill = Math.min(Math.max(Number(record.fillPercentage) || 0, 0), 100);

                            return (
                                <tr key={record.id || index} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
                                    <td className="px-4 py-3 align-middle">
                                        <div className="font-medium text-slate-800 dark:text-slate-200">{timeStr}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">{dateStr}</div>
                                    </td>
                                    <td className="px-4 py-3 align-middle">
                                        <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                            {record.deviceId}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 align-middle">
                                        <div className="flex min-w-44 items-center gap-3">
                                            <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                                <div className={`h-full rounded-full ${getBarClass(record.status)}`} style={{ width: `${fill}%` }} />
                                            </div>
                                            <span className="w-10 text-right text-sm font-semibold text-slate-800 dark:text-slate-200">{fill}%</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 align-middle">
                                        <span className={`inline-flex min-w-16 justify-center rounded-md border px-2.5 py-1 text-xs font-bold uppercase ${getStatusClass(record.status)}`}>
                                            {getStatusText(record.status)}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                        {(!Array.isArray(historyData) || historyData.length === 0) && (
                            <tr>
                                <td colSpan="4" className="px-4 py-16 text-center text-sm text-slate-500 dark:text-slate-400">
                                    {t('noHistory')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistoryTable;
