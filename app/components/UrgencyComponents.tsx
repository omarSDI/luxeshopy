'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShoppingCart, User, MapPin } from 'lucide-react';

interface InventoryCounterProps {
  stock: number;
  variantName?: string;
}

export function InventoryCounter({ stock, variantName }: InventoryCounterProps) {
  // Simulate a "dynamic" feel by slightly varying the low stock message
  const [displayStock, setDisplayStock] = useState(stock);
  
  useEffect(() => {
    setDisplayStock(stock);
  }, [stock]);

  if (stock <= 0) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg animate-pulse">
      <AlertTriangle className="w-4 h-4 text-red-500" />
      <span className="text-red-500 text-[10px] font-black uppercase tracking-widest">
        Dépêchez-vous! Seuls {displayStock} restants {variantName ? `en ${variantName}` : ''}!
      </span>
    </div>
  );
}

export function LiveSalesPopup() {
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
          initial={{ opacity: 0, x: -50, y: 50 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="fixed bottom-6 left-6 z-[60] bg-white text-black p-3 pr-6 rounded-2xl shadow-2xl border border-gray-100 flex items-center gap-3 pointer-events-none"
        >
          <div className="w-10 h-10 bg-[#00FF41]/10 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-[#00FF41]" />
          </div>
          <div className="flex flex-col">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Achat récent</p>
            <p className="text-xs font-black flex items-center gap-1">
              Client de <span className="text-[#00FF41]">{currentSale.city}</span>
              <MapPin className="w-3 h-3" />
            </p>
            <p className="text-[9px] text-gray-500 italic">Il y a {currentSale.time}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function StickyBuyBar({ price, onBuy }: { price: number; onBuy: () => void }) {
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
            className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/80 backdrop-blur-xl border-t border-white/10 md:hidden flex items-center justify-between gap-4"
        >
            <div className="flex flex-col">
                <span className="text-white/50 text-[10px] font-black uppercase tracking-widest leading-none">Prix Total</span>
                <span className="text-[#00FF41] text-xl font-black">{price.toFixed(2)} TND</span>
            </div>
            <button 
                onClick={onBuy}
                className="flex-1 bg-[#00FF41] text-black font-black py-4 rounded-xl text-sm italic uppercase tracking-tighter shadow-[0_0_20px_rgba(0,255,65,0.3)]"
            >
                COMMANDER
            </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
