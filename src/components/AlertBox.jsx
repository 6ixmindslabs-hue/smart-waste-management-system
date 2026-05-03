import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const AlertBox = ({ isVisible }) => {
    const { t } = useLanguage();

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed top-6 right-6 z-50 w-96 bg-red-50 dark:bg-red-900/90 border-l-4 border-red-500 shadow-2xl rounded-r-lg p-4 flex items-start gap-4 backdrop-blur-md"
                >
                    <div className="bg-red-100 dark:bg-red-800 p-2 rounded-full flex-shrink-0">
                        <AlertTriangle className="text-red-600 dark:text-red-200 w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-red-800 dark:text-red-100 font-bold text-lg">{t('criticalAlert')}</h4>
                        <p className="text-red-700 dark:text-red-200 text-sm mt-1">
                            {t('alertMessage')}
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AlertBox;
