'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, User, MapPin, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface InventoryCounterProps {
  stock: number;
  variantName?: string;
}

export function InventoryCounter({ stock, variantName }: InventoryCounterProps) {
  const { t } = useLanguage();
  const [displayStock, setDisplayStock] = useState(stock);
  
  useEffect(() => {
    setDisplayStock(stock);
  }, [stock]);

  if (stock <= 0) return null;

  const message = t('stockAlert')
    .replace('{count}', displayStock.toString())
    .replace('{variant}', variantName ? `(${variantName})` : '');

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-xl animate-pulse">
      <AlertTriangle className="w-4 h-4 text-red-600" />
      <span className="text-red-600 text-[10px] font-black uppercase tracking-widest leading-none">
        {message}
      </span>
    </div>
  );
}

export function LiveSalesPopup() {
  const { t, isRTL } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [currentSale, setCurrentSale] = useState({ city: 'Tunis', time: '2 mins' });
  
  const cities = ['Tunis', 'Sousse', 'Sfax', 'Nabeul', 'Bizerte', 'Ariana', 'Monastir', 'Hammamet'];
  const times = ['1 min', '3 mins', '5 mins', '10 mins', '12 mins'];

  useEffect(() => {
    const showPopup = () => {
      const city = cities[Math.floor(Math.random() * cities.length)];
      const time = times[Math.floor(Math.random() * times.length)];
      setCurrentSale({ city, time });
      setIsVisible(true);
      
      setTimeout(() => setIsVisible(false), 5000); // Show for 5 seconds
    };

    const interval = setInterval(showPopup, 20000); // Every 20 seconds
    const initialTimeout = setTimeout(showPopup, 5000); // Initial show after 5s

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 50 : -50, y: 50 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: isRTL ? 50 : -50 }}
          className={`fixed bottom-6 ${isRTL ? 'right-6' : 'left-6'} z-[60] bg-white text-[#001f3f] p-4 pr-8 rounded-[1.5rem] shadow-2xl border border-gray-100 flex items-center gap-4 pointer-events-none`}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <div className="w-12 h-12 bg-[#d4af37]/10 rounded-2xl flex items-center justify-center border border-[#d4af37]/20">
            <User className="w-6 h-6 text-[#d4af37]" />
          </div>
          <div className="flex flex-col">
            <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-[0.2em] mb-0.5">{t('recentPurchase')}</p>
            <p className="text-sm font-black flex items-center gap-1.5 leading-none">
              {t('clientFrom')} <span className="text-[#d4af37]">{currentSale.city}</span>
              <MapPin className="w-3.5 h-3.5" />
            </p>
            <p className="text-[10px] text-gray-500 font-bold mt-1">{t('ago')} {currentSale.time}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function StickyBuyBar({ price, onBuy }: { price: number; onBuy: () => void }) {
  const { t, isRTL } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 600); // Show after scrolling 600px
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur-xl border-t border-gray-100 md:hidden flex items-center justify-between gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]"
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <div className={`flex flex-col ${isRTL ? 'pr-2' : 'pl-2'}`}>
                <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest leading-none mb-1">{t('totalPrice')}</span>
                <span className="text-[#001f3f] text-xl font-black">{price.toFixed(2)} TND</span>
            </div>
            <button 
                onClick={onBuy}
                className="flex-1 bg-[#d4af37] text-[#001f3f] font-black py-4 rounded-2xl text-sm uppercase tracking-widest shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
                {t('orderNow')}
                <ShoppingBag className="w-4 h-4" />
            </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
