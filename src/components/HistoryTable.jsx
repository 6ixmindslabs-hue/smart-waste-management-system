import React from 'react';
import { Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const HistoryTable = ({ historyData }) => {
    const { t } = useLanguage();

    // Translate status
    const getStatusText = (status) => {
        if (status === 'EMPTY') return t('empty');
        if (status === 'HALF') return t('half');
        if (status === 'FULL') return t('full');
        return status;
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700 flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-500" />
                    {t('recentActivity')}
                </h3>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('lastRecords')}</span>
            </div>

            <div className="overflow-y-auto overflow-x-auto flex-1 h-full scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 sticky top-0 z-10 backdrop-blur-sm">
                        <tr>
                            <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('time')}</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('device')}</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('fillLevel')}</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('status')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {Array.isArray(historyData) && historyData.map((record, index) => {
                            const date = new Date(record.createdAt);
                            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                            const dateStr = date.toLocaleDateString();

                            let statusColor = 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/30 dark:text-emerald-400';
                            if (record.status === 'HALF') statusColor = 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-900/30 dark:text-amber-400';
                            if (record.status === 'FULL') statusColor = 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-900/30 dark:text-rose-400';

                            return (
                                <tr key={record.id || index} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-slate-700 dark:text-slate-300">{timeStr}</div>
                                        <div className="text-xs text-slate-400 dark:text-slate-500">{dateStr}</div>
                                    </td>
                                    <td className="p-4 text-slate-600 dark:text-slate-400 font-mono text-sm">
                                        {record.deviceId}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${record.status === 'FULL' ? 'bg-rose-500' : record.status === 'HALF' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${record.fillPercentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{record.fillPercentage}%</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
                                            {getStatusText(record.status)}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                        {(!Array.isArray(historyData) || historyData.length === 0) && (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-slate-400 dark:text-slate-500">
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
