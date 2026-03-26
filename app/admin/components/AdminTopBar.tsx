'use client';

import { Bell, User, Sun, Moon, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAdminRealtime } from '../context/AdminRealtimeProvider';
import { adminLogout } from '@/app/actions/admin';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '@/app/context/ThemeContext';

export default function AdminTopBar() {
    const { isDarkMode, toggleTheme } = useTheme();
    const { language, setLanguage, isRTL } = useLanguage();
    const { unreadCount, notifications, markAllRead, unreadNotificationCount, resetNotificationCount } = useAdminRealtime();
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <header className="px-8 py-5 flex items-center justify-between sticky top-0 z-30 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl" dir={isRTL ? 'rtl' : 'ltr'}>

            {/* Left Side: Brand Date/Time */}
            <div className="flex items-center gap-8">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.3em]">System Time</span>
                    <span className="text-white/40 text-[10px] font-bold uppercase mt-0.5">
                        {new Date().toLocaleDateString(language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Right Side: Actions */}
            <div className="flex items-center gap-6">

                {/* Language Switcher */}
                <div className="flex items-center gap-2">
                    {['en', 'fr', 'ar'].map((lang) => (
                        <button
                            key={lang}
                            onClick={() => setLanguage(lang as any)}
                            className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase transition-all ${language === lang
                                ? 'bg-[#d4af37] text-black shadow-[0_5px_15px_rgba(212,175,55,0.3)]'
                                : 'text-white/30 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {lang}
                        </button>
                    ))}
                </div>

                {/* Notifications */}
                <div className="relative">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            if (!showNotifications) {
                                resetNotificationCount();
                                if (unreadCount > 0) markAllRead();
                            }
                        }}
                        className="p-3 text-white/30 hover:text-[#00FF41] hover:bg-white/5 rounded-2xl relative transition-all"
                    >
                        <Bell className="w-5 h-5 transition-colors" />
                        {unreadNotificationCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#00FF41] text-[10px] font-black text-black border-2 border-[#050505] shadow-[0_0_15px_rgba(0,255,65,0.5)]"
                            >
                                {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                            </motion.span>
                        )}
                    </motion.button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                className={`absolute right-0 rtl:left-0 rtl:right-auto mt-4 w-96 bg-[#0a0a0a] border border-white/5 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] py-4 z-50 max-h-[500px] overflow-y-auto scrollbar-hide`}
                            >
                                <div className="px-8 py-4 border-b border-white/5 flex justify-between items-center">
                                    <h3 className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.4em]">Intelligence Feed</h3>
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{notifications.length} Nodes</span>
                                </div>
                                {notifications.length === 0 ? (
                                    <div className="p-10 text-center text-white/20 text-[10px] font-black uppercase tracking-widest italic">
                                        No active transmissions
                                    </div>
                                ) : (
                                    notifications.map((notif: any) => (
                                        <div key={notif.id} className="px-8 py-5 border-b border-white/5 hover:bg-white/[0.03] transition-colors group cursor-pointer">
                                            <p className="text-[11px] font-black text-white group-hover:text-[#00FF41] transition-colors uppercase tracking-widest">{notif.title}</p>
                                            <p className="text-[10px] text-white/40 mt-1 uppercase font-bold tracking-tight">{notif.message}</p>
                                            <p className="text-[8px] text-white/10 mt-2 font-black italic">{new Date(notif.time).toLocaleTimeString()}</p>
                                        </div>
                                    ))
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="h-6 w-[1px] bg-white/10 mx-2"></div>

                {/* User Profile */}
                <div className="relative group">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center gap-3 p-1 rounded-full border border-white/10 hover:border-[#d4af37] transition-all bg-white/5"
                    >
                        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                            <User className="w-5 h-5 text-black" />
                        </div>
                    </motion.button>

                    <div className="absolute right-0 rtl:left-0 rtl:right-auto pt-4 w-64 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-50">
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] shadow-2xl p-2">
                            <div className="px-6 py-4 border-b border-white/5">
                                <p className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.4em]">Administrator</p>
                                <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mt-1">LuxeShopy Core</p>
                            </div>
                            <button
                                onClick={async () => {
                                    await adminLogout();
                                    localStorage.removeItem('supabase.auth.token');
                                    sessionStorage.clear();
                                    window.location.href = '/admin/login';
                                }}
                                className="w-full text-left px-6 py-4 text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500/10 rounded-[1.5rem] flex items-center gap-3 transition-all"
                            >
                                <LogOut className="w-4 h-4" /> Terminate Session
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
