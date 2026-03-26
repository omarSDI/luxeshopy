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
        <header className={`border-b px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-[#001f3f] border-[#d4af37]/30' : 'bg-white border-[#d4af37]/20'}`} dir={isRTL ? 'rtl' : 'ltr'}>

            {/* Left Side: Brand Date/Time */}
            <div className="flex items-center gap-6 text-sm">
                <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-medium`}>
                    {new Date().toLocaleDateString(language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded border transition-all shadow-sm ${isDarkMode
                        ? 'bg-[#d4af37] text-[#001f3f] border-[#d4af37] hover:bg-white hover:border-white'
                        : 'bg-[#001f3f] text-[#d4af37] border-[#d4af37] hover:bg-[#d4af37] hover:text-[#001f3f]'
                        }`}
                >
                    View My Store
                </a>
            </div>

            {/* Right Side: Actions */}
            <div className="flex items-center gap-4">

                {/* Language Switcher */}
                <div className="flex items-center gap-2 me-2">
                    {['en', 'fr', 'ar'].map((lang) => (
                        <button
                            key={lang}
                            onClick={() => setLanguage(lang as any)}
                            className={`text-xs font-bold px-2 py-1 rounded uppercase transition-colors ${language === lang
                                ? (isDarkMode ? 'bg-[#d4af37] text-[#001f3f]' : 'bg-[#001f3f] text-[#d4af37]')
                                : (isDarkMode ? 'text-gray-400 hover:text-[#d4af37]' : 'text-gray-400 hover:text-[#001f3f]')
                                }`}
                        >
                            {lang}
                        </button>
                    ))}
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className={`p-2 transition-colors rounded-full ${isDarkMode ? 'text-[#d4af37] hover:bg-white/10' : 'text-gray-400 hover:text-[#d4af37] hover:bg-gray-100'}`}
                >
                    {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>

                {/* Notifications */}
                <div className="relative">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            if (!showNotifications) {
                                resetNotificationCount();
                                if (unreadCount > 0) markAllRead();
                            }
                        }}
                        className={`p-2 transition-colors relative ${isDarkMode ? 'text-gray-400 hover:text-[#d4af37]' : 'text-gray-400 hover:text-[#d4af37]'}`}
                    >
                        <Bell className="w-5 h-5" />
                        {unreadNotificationCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white border-2 border-white shadow-sm"
                            >
                                {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                            </motion.span>
                        )}
                    </motion.button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className={`absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-80 rounded-lg shadow-xl border py-2 z-50 max-h-96 overflow-y-auto ${isDarkMode ? 'bg-[#001f3f] border-[#d4af37]/30 text-white' : 'bg-white border-gray-100'
                                    }`}
                            >
                                <div className={`px-4 py-2 border-b flex justify-between items-center ${isDarkMode ? 'border-[#d4af37]/20' : 'border-gray-100'}`}>
                                    <h3 className={`font-bold ${isDarkMode ? 'text-[#d4af37]' : 'text-[#001f3f]'}`}>Notifications</h3>
                                    <span className="text-xs text-gray-500">{notifications.length} new</span>
                                </div>
                                {notifications.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500 text-sm">
                                        No new notifications
                                    </div>
                                ) : (
                                    notifications.map((notif: any) => (
                                        <div key={notif.id} className={`px-4 py-3 border-b last:border-0 transition-colors ${isDarkMode
                                            ? `hover:bg-white/5 border-[#d4af37]/10 ${!notif.read ? 'bg-white/10' : ''}`
                                            : `hover:bg-gray-50 border-gray-50 ${!notif.read ? 'bg-blue-50/50' : ''}`
                                            }`}>
                                            <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-[#001f3f]'}`}>{notif.title}</p>
                                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{notif.message}</p>
                                            <p className="text-[10px] text-gray-400 mt-1">{new Date(notif.time).toLocaleTimeString()}</p>
                                        </div>
                                    ))
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className={`h-8 w-[1px] mx-2 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>

                {/* User Profile */}
                <div className="relative group">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-2 p-1.5 rounded-full border transition-colors ${isDarkMode ? 'border-white/10 hover:border-[#d4af37]' : 'border-gray-200 hover:border-[#d4af37]'
                            }`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-serif ${isDarkMode ? 'bg-[#d4af37]' : 'bg-[#001f3f]'}`}>
                            <User className={`w-4 h-4 ${isDarkMode ? 'text-[#001f3f]' : 'text-white'}`} />
                        </div>
                    </motion.button>

                    <div className="absolute right-0 rtl:left-0 rtl:right-auto pt-2 w-48 hidden group-hover:block z-50">
                        <div className={`rounded-lg shadow-xl border py-1 ${isDarkMode ? 'bg-[#001f3f] border-[#d4af37]/30' : 'bg-white border-gray-100'}`}>
                            <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-[#d4af37]/20 text-white' : 'border-gray-100'}`}>
                                <p className="text-sm font-bold">Welcome back</p>
                                <p className="text-xs text-gray-400">Admin</p>
                            </div>
                            <button
                                onClick={async () => {
                                    const btn = document.getElementById('logout-btn') as HTMLButtonElement;
                                    if (btn) {
                                        btn.innerText = 'Logging out...';
                                        btn.disabled = true;
                                    }
                                    await adminLogout();
                                    localStorage.removeItem('supabase.auth.token');
                                    sessionStorage.clear();
                                    window.location.href = '/admin/login';
                                }}
                                id="logout-btn"
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
