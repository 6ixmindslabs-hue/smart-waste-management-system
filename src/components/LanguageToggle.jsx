import { Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LanguageToggle = () => {
    const { toggleLanguage, t } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 sm:w-auto"
            aria-label="Toggle language"
        >
            <Languages className="h-4 w-4" />
            <span className="inline">{t('translateBtn')}</span>
        </button>
    );
};

export default LanguageToggle;
