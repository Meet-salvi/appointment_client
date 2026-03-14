import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const Preloader = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0B0E14]">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[100px] rounded-full"></div>
            
            <div className="relative flex flex-col items-center gap-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: 1,
                    }}
                    transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/20 p-5"
                >
                    <Activity className="text-white w-full h-full" />
                </motion.div>

                <div className="flex flex-col items-center gap-2">
                    <motion.h2 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl font-bold tracking-tight text-white"
                    >
                        MedPulse<span className="text-primary">.</span>
                    </motion.h2>
                    <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden relative">
                        <motion.div 
                            initial={{ left: "-100%" }}
                            animate={{ left: "100%" }}
                            transition={{ 
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent"
                        />
                    </div>
                </div>
            </div>

            <style>{`
                .text-primary { color: #14b8a6; }
                .bg-primary\\/20 { background-color: rgba(20, 184, 166, 0.2); }
                .from-primary { --tw-gradient-from: #14b8a6; --tw-gradient-to: rgb(20 184 166 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
                .to-secondary { --tw-gradient-to: #6366f1; }
            `}</style>
        </div>
    );
};

export default Preloader;
