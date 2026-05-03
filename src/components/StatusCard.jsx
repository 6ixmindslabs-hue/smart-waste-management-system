import { AlertOctagon, AlertTriangle, CheckCircle } from 'lucide-react';
import DustbinAnimation from './DustbinAnimation';
import { useLanguage } from '../context/LanguageContext';

const StatusCard = ({ data }) => {
    const { t } = useLanguage();

    if (!data) return null;

    const { fillPercentage = 0, status, deviceId, friendlyName, details } = data;
    const normalizedFill = Math.min(Math.max(Number(fillPercentage) || 0, 0), 100);

    const statusConfig = {
        EMPTY: {
            text: 'text-emerald-700 dark:text-emerald-300',
            bg: 'bg-emerald-50 dark:bg-emerald-950/40',
            border: 'border-emerald-200 dark:border-emerald-900/60',
            bar: 'bg-emerald-500',
            Icon: CheckCircle,
        },
        HALF: {
            text: 'text-amber-700 dark:text-amber-300',
            bg: 'bg-amber-50 dark:bg-amber-950/40',
            border: 'border-amber-200 dark:border-amber-900/60',
            bar: 'bg-amber-500',
            Icon: AlertTriangle,
        },
        FULL: {
            text: 'text-rose-700 dark:text-rose-300',
            bg: 'bg-rose-50 dark:bg-rose-950/40',
            border: 'border-rose-200 dark:border-rose-900/60',
            bar: 'bg-rose-500',
            Icon: AlertOctagon,
        },
    };

    const current = statusConfig[status] || statusConfig.EMPTY;
    const Icon = current.Icon;

    const getStatusText = () => {
        if (status === 'EMPTY') return t('empty');
        if (status === 'HALF') return t('half');
        if (status === 'FULL') return t('full');
        return status || 'UNKNOWN';
    };

    return (
        <article className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-cyan-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-cyan-900/70 sm:p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{t('deviceId')}</p>
                    <h3 className="mt-1 truncate text-base font-bold text-slate-950 dark:text-white sm:text-lg" title={friendlyName || deviceId}>
                        {friendlyName || deviceId || t('waiting')}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                        {friendlyName && friendlyName !== deviceId && (
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                {deviceId}
                            </span>
                        )}
                        {details && (
                            <span className="truncate text-xs text-slate-500 dark:text-slate-400">{details}</span>
                        )}
                    </div>
                </div>

                <div className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px] font-bold uppercase sm:px-2.5 sm:text-xs ${current.bg} ${current.text} ${current.border}`}>
                    <Icon className="h-3.5 w-3.5" />
                    {getStatusText()}
                </div>
            </div>

            <div className="mt-3 grid grid-cols-[112px_1fr] items-center gap-3 sm:mt-4 sm:block">
                <div className="min-w-0">
                    <DustbinAnimation fillPercentage={normalizedFill} />
                </div>
                <div className="space-y-3 sm:hidden">
                    <div>
                        <div className="text-3xl font-bold leading-none text-slate-950 dark:text-white">{Math.round(normalizedFill)}%</div>
                        <div className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{t('capacityUsage')}</div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div className={`h-full rounded-full ${current.bar}`} style={{ width: `${normalizedFill}%` }} />
                    </div>
                </div>
            </div>

            <div className="mt-3 hidden space-y-2 sm:block">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">{t('capacityUsage')}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{Math.round(normalizedFill)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className={`h-full rounded-full ${current.bar}`} style={{ width: `${normalizedFill}%` }} />
                </div>
            </div>
        </article>
    );
};

export default StatusCard;
