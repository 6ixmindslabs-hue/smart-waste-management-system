import { Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LanguageToggle = () => {
    const { toggleLanguage, t } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 rounded-full transition-colors duration-200 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm font-medium text-slate-700 dark:text-slate-300"
            aria-label="Toggle language"
        >
            <Languages className="w-4 h-4" />
            <span>{t('translateBtn')}</span>
        </button>
    );
};

export default LanguageToggle;
