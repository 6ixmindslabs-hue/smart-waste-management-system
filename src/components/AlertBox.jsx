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
                    className="fixed left-4 right-4 top-4 z-50 flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 shadow-lg dark:border-rose-900/60 dark:bg-rose-950/90 sm:left-auto sm:w-[28rem]"
                >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900">
                        <AlertTriangle className="h-5 w-5 text-rose-700 dark:text-rose-200" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-rose-900 dark:text-rose-100">{t('criticalAlert')}</h4>
                        <p className="mt-1 text-sm leading-5 text-rose-700 dark:text-rose-200">
                            {t('alertMessage')}
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AlertBox;
