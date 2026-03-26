'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Menu,
  X,
  Store,
  LogOut,
  Settings,
  Users,
  Tag,
  BarChart3,
  FileText,
  Grid,
  Share2,
  Headphones,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { adminLogout } from '@/app/actions/admin';
import NotificationBell from './NotificationBell';
import { useAdminRealtime } from '../context/AdminRealtimeProvider';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { pendingCount } = useAdminRealtime();
  const { t, isRTL } = useLanguage();

  const menuItems = [
    { href: '/admin/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/admin/orders', label: t('orders'), icon: ShoppingBag, badge: pendingCount > 0 ? pendingCount.toString() : undefined },
    { href: '/admin/products', label: t('products'), icon: Package },
    { href: '/admin/customers', label: t('customers'), icon: Users },
    { href: '/admin/insights', label: t('insights'), icon: BarChart3 },
    { href: '/admin/invoices', label: t('invoices'), icon: FileText },
    { href: '/admin/marketing', label: 'Marketing', icon: Share2 },
    { href: '/admin/settings', label: t('settings'), icon: Settings },
  ];

  const handleLogout = async () => {
    await adminLogout();
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();
    window.location.href = '/admin/login';
  };

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 h-full bg-[#050505] border-r border-white/10 z-50 transition-all duration-300 shadow-2xl 
          ${isRTL ? 'right-0 border-l border-r-0' : 'left-0 border-r'} 
          ${isCollapsed
            ? (isRTL ? 'translate-x-full lg:translate-x-0 lg:w-20' : '-translate-x-full lg:translate-x-0 lg:w-20')
            : 'translate-x-0 w-64'
          }`}
      >
        <div className="flex flex-col h-full bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-white/5">
            {!isCollapsed && (
              <h2
                className="text-2xl font-black text-[#d4af37] tracking-tighter italic"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                LUXE<span className="text-white">SHOPY</span>
                <span className="block text-[#00FF41] text-[9px] font-black uppercase tracking-[0.4em] mt-1 not-italic">Admin Matrix</span>
              </h2>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 text-white/40 hover:text-[#d4af37] hover:bg-white/5 rounded-xl transition-all"
            >
              {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-500 group ${isActive
                      ? 'bg-[#d4af37] text-black shadow-[0_10px_30px_rgba(212,175,55,0.3)]'
                      : 'text-white/40 hover:text-[#d4af37] hover:bg-white/5'
                      }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    {!isCollapsed && (
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                        {item.badge && (
                          <span className="bg-[#00FF41] text-black text-[9px] font-black px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(0,255,65,0.4)]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="p-6 border-t border-white/5 space-y-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-[#00FF41] hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest"
            >
              <Store className="w-5 h-5" />
              {!isCollapsed && <span>Live Store</span>}
            </a>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-all text-[10px] font-black uppercase tracking-widest"
            >
              <LogOut className="w-5 h-5" />
              {!isCollapsed && <span>Terminate</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
