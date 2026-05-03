import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-colors duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? (
                <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            ) : (
                <Sun className="w-5 h-5 text-amber-500 hover:text-amber-400" />
            )}
        </button>
    );
};

export default ThemeToggle;
