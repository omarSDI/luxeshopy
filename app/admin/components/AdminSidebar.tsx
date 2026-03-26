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
        className={`fixed top-0 h-full bg-gradient-to-b from-[#001f3f] to-[#001f3f] border-r-2 border-[#d4af37]/30 z-50 transition-all duration-300 shadow-2xl 
          ${isRTL ? 'right-0 border-l-2 border-r-0' : 'left-0 border-r-2'} 
          ${isCollapsed
            ? (isRTL ? 'translate-x-full lg:translate-x-0 lg:w-20' : '-translate-x-full lg:translate-x-0 lg:w-20')
            : 'translate-x-0 w-64'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b-2 border-[#d4af37]/30">
            {!isCollapsed && (
              <h2
                className="text-xl font-bold text-[#d4af37]"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                LuxeShopy
                <span className="block text-white text-sm font-normal mt-1">Admin Panel</span>
              </h2>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 text-[#d4af37] hover:text-white hover:bg-[#d4af37]/20 rounded-lg transition-colors"
            >
              {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#b8941e] text-[#001f3f] shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <div className="flex-1 flex items-center justify-between">
                        <span className="font-semibold">{item.label}</span>
                        {item.badge && (
                          <span className="bg-[#0ea5e9] text-white text-xs font-bold px-2 py-0.5 rounded-full">
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
          <div className="p-4 border-t-2 border-[#d4af37]/30 space-y-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Store className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">View Store</span>}
            </a>
            <button
              onClick={async () => {
                await handleLogout();
                window.location.href = '/admin/login';
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
