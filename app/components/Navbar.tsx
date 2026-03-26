'use client';

import { useEffect, useState } from 'react';
import { ShoppingCart, Menu, X, Crown } from 'lucide-react';
import SettingsClient from '@/app/admin/settings/SettingsClient';
import Link from 'next/link';
import { useCartStore } from '../store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from './LanguageToggle';
import Marquee from './Marquee';
import Logo3D from './Logo3D';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartCount = useCartStore((state) => state.getTotalItems());
  const toggleCart = useCartStore((state) => state.toggleCart);
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        <div className="h-10 w-full bg-[#D4AF37]"></div>
        <nav className="sticky top-0 z-50 w-full bg-white border-b border-[#D4AF37]/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="h-8 w-32 skeleton rounded"></div>
              <div className="h-8 w-8 skeleton rounded"></div>
            </div>
          </div>
        </nav>
      </>
    );
  }

  const navLinks = [
    { href: '/shop', label: t('shop') },
    { href: '/category/new-tech', label: t('newTech') },
    { href: '/category/wearables', label: t('wearables') },
    { href: '/category/accessories', label: t('accessories') },
    { href: '/contact', label: t('contact') },
  ];

  return (
    <div className="sticky top-0 z-50 w-full">
      <Marquee />
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white/80 backdrop-blur-xl border-b border-[#D4AF37]/20 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24">
            {/* Logo */}
            <Link href="/" className="flex items-center scale-90 sm:scale-100">
              <Logo3D />
            </Link>

            {/* Navigation Links - Desktop Only */}
            <div className="hidden md:flex items-center space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-[#001f3f] hover:text-[#d4af37] transition-all font-bold text-xs uppercase tracking-[0.2em] group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#d4af37] group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Desktop Only Actions */}
              <div className="hidden md:flex items-center gap-4">
                <LanguageToggle />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleCart}
                  className="relative p-3 bg-gray-50 text-[#001f3f] hover:bg-[#001f3f] hover:text-[#d4af37] transition-all rounded-2xl border border-gray-100"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#d4af37] text-[10px] font-black text-[#001f3f] shadow-lg border-2 border-white">
                      {cartCount}
                    </span>
                  )}
                </motion.button>
              </div>

              {/* Mobile Menu Toggle - "Ken 3 Matat" (The Hamburger Focus) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-3 bg-gray-50 text-[#001f3f] hover:bg-[#001f3f] hover:text-[#d4af37] transition-all rounded-2xl border border-gray-100"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Full Screen Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: isRTL ? '100%' : '-100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? '100%' : '-100%' }}
              className="fixed inset-0 z-50 bg-white md:hidden overflow-y-auto"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
                <div className="p-6 flex flex-col h-full">
                    {/* Menu Header */}
                    <div className="flex items-center justify-between mb-12">
                        <Logo3D />
                        <button 
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-3 bg-gray-50 text-[#001f3f] rounded-2xl border border-gray-100"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation - Big Vertical Links */}
                    <div className="flex flex-col space-y-6 flex-1">
                        {navLinks.map((link, index) => (
                            <motion.div
                                key={link.href}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-4xl font-black text-[#001f3f] hover:text-[#d4af37] transition-colors tracking-tighter uppercase italic"
                                    style={{ fontFamily: 'Playfair Display, serif' }}
                                >
                                    {link.label}
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Mobile Footer Actions (Moved from Main Bar to Menu) */}
                    <div className="pt-8 border-t border-gray-100 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Language</span>
                                <LanguageToggle />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Your Bag</span>
                                <button 
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        toggleCart();
                                    }}
                                    className="flex items-center gap-3 px-6 py-3 bg-[#001f3f] text-white rounded-2xl border border-[#001f3f] shadow-lg shadow-[#001f3f]/10"
                                >
                                    <ShoppingCart className="w-5 h-5 text-[#d4af37]" />
                                    <span className="font-bold">{cartCount} {t('items')}</span>
                                </button>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100">
                                    <Crown className="w-5 h-5 text-[#d4af37]" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-[#001f3f] uppercase">LuxeShopy Premium</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Experience Luxury</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
