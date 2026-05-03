import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const TrashParticle = ({ delay, duration, x, y, size = 10 }) => (
    <motion.div
        animate={{ y: [0, -15, 0], x: [0, 5, 0], rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration, delay, ease: "easeInOut" }}
        className="absolute bg-white/40 rounded-sm shadow-sm border border-white/20"
        style={{ width: size, height: size, left: x, top: y }}
    />
);

const DustbinAnimation = ({ fillPercentage }) => {
    const [isHovered, setIsHovered] = useState(false);
    const lidControls = useAnimation();
    const pct = Number.isNaN(Number(fillPercentage)) ? 0 : Number(fillPercentage);
    const level = Math.min(Math.max(pct, 0), 100);

    useEffect(() => {
        if (isHovered || level > 80) {
            lidControls.start({ rotate: -25, y: -15 });
        } else {
            lidControls.start({ rotate: 0, y: 0 });
        }
    }, [isHovered, level, lidControls]);

    const getColor = (value) => {
        if (value >= 80) return '#e11d48';
        if (value >= 50) return '#f59e0b';
        return '#10b981';
    };

    const getBadgeText = (value) => {
        if (value >= 90) return "CRIT";
        if (value >= 80) return "WARN";
        if (value >= 50) return "HALF";
        if (value >= 20) return "OK";
        return "LOW";
    };

    const color = getColor(level);

    return (
        <div className="flex items-center justify-center py-1 sm:py-2 select-none">
            <motion.div
                className="relative h-32 w-24 cursor-pointer sm:h-44 sm:w-32"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <motion.div
                    className="absolute -right-4 top-0 z-30 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] font-black shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:-right-6 sm:px-2 sm:py-1 sm:text-[10px]"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, 10, 0] }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                    {getBadgeText(level)}
                </motion.div>

                {level >= 80 && (
                    <motion.div
                        className="absolute inset-0 -z-10 rounded-b-lg bg-rose-400 blur-xl dark:bg-rose-600"
                        animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    />
                )}

                <motion.div
                    animate={lidControls}
                    transition={{ type: "spring", stiffness: 120, damping: 10 }}
                    style={{ originX: 0.1, originY: 1 }}
                    className="absolute -top-4 left-0 w-full z-20"
                >
                    <svg viewBox="0 0 100 20" className="w-full drop-shadow-xl filter">
                        <path d="M5 20 L2 15 L15 5 L85 5 L98 15 L95 20 Z" className="fill-slate-700 dark:fill-slate-500" />
                        <rect x="35" y="0" width="30" height="6" rx="3" className="fill-slate-700 dark:fill-slate-500" />
                        <path d="M15 5 L85 5" className="stroke-slate-600 dark:stroke-slate-400" strokeWidth="2" />
                    </svg>
                </motion.div>

                <div className="relative h-full w-full overflow-hidden rounded-b-lg border-[3px] border-slate-700 bg-slate-50 shadow-lg dark:border-slate-500 dark:bg-slate-800">
                    <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#cbd5e1_1px,transparent_1px)] dark:bg-[linear-gradient(45deg,#475569_1px,transparent_1px)] [background-size:10px_10px]"></div>

                    <motion.div
                        className="absolute bottom-0 left-0 right-0 w-full"
                        initial={{ height: 0 }}
                        animate={{ height: `${level}%` }}
                        transition={{ type: "spring", stiffness: 60, damping: 20 }}
                    >
                        <div className="w-full h-full relative" style={{ backgroundColor: color, opacity: 0.85 }}>
                            {level > 10 && (
                                <>
                                    <TrashParticle delay={0} duration={3.2} x="20%" y="30%" size={12} />
                                    <TrashParticle delay={1} duration={4.1} x="60%" y="50%" size={8} />
                                    <TrashParticle delay={2} duration={3.6} x="40%" y="20%" size={10} />
                                    <TrashParticle delay={0.5} duration={4.8} x="70%" y="70%" size={6} />
                                </>
                            )}
                        </div>

                        <motion.div
                            className="absolute -top-4 left-0 right-0 h-8 w-[200%]"
                            style={{ backgroundColor: color, opacity: 0.6, borderRadius: '40%' }}
                            animate={{ x: ["-50%", "0%"] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                        />
                        <motion.div
                            className="absolute -top-3 left-0 right-0 h-8 w-[200%]"
                            style={{ backgroundColor: color, opacity: 0.9, borderRadius: '45%' }}
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        />
                    </motion.div>

                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/5 pointer-events-none rounded-b-lg"></div>
                    <div className="absolute top-2 left-2 w-1.5 h-full bg-white/20 rounded-full blur-[1px]"></div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none drop-shadow-md">
                    <motion.span
                        key={level}
                        initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        className={`text-3xl font-black sm:text-4xl ${level > 55 ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                    >
                        {Math.round(level)}
                        <span className="text-base align-top sm:text-xl">%</span>
                    </motion.span>
                </div>
            </motion.div>
        </div>
    );
};

export default DustbinAnimation;
