'use client';

import { useEffect, useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useLanguage } from '../context/LanguageContext';
import Link from 'next/link';

export default function CartSidebar() {
  const [mounted, setMounted] = useState(false);
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getTotalPrice,
  } = useCartStore();
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#001f3f]/40 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Sidebar — slides from right in LTR, from left in RTL */}
          <motion.div
            initial={{ x: isRTL ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`absolute top-0 bottom-0 w-full sm:max-w-[480px] bg-white shadow-2xl flex flex-col ${isRTL ? 'left-0' : 'right-0'}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-[#d4af37]/20 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#001f3f] rounded-xl flex items-center justify-center shadow-lg shadow-[#001f3f]/20">
                  <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#001f3f] tracking-tight uppercase" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {t('shoppingCart')}
                  </h2>
                  <p className="text-[10px] text-[#d4af37] font-bold tracking-widest uppercase">
                    {items.length} {items.length === 1 ? 'Article' : 'Articles'}
                  </p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="group flex items-center gap-2 p-2 px-3 bg-gray-50 hover:bg-[#001f3f] text-[#001f3f] hover:text-white rounded-2xl transition-all duration-300 border border-gray-100"
                aria-label="Continue shopping"
              >
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Fermer</span>
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4 scrollbar-hide">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-10">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
                    <ShoppingBag className="w-10 h-10 text-gray-200" />
                  </div>
                  <h3 className="text-xl font-bold text-[#001f3f] mb-2">{t('cartEmpty')}</h3>
                  <p className="text-gray-400 text-sm mb-8 max-w-[200px]">{t('cartEmptySub')}</p>
                  <button 
                    onClick={closeCart}
                    className="px-8 py-3 bg-[#001f3f] text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-[#d4af37] transition-colors"
                  >
                    Découvrir la collection
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.lineId}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="group flex gap-4 p-4 bg-white border border-gray-100 rounded-[2rem] hover:border-[#d4af37]/30 transition-all shadow-sm hover:shadow-xl hover:shadow-[#d4af37]/5"
                    >
                      {/* Product Image */}
                      <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-50 rounded-3xl flex-shrink-0 overflow-hidden border border-gray-50">
                        {item.image_url ? (
                          <img 
                            src={item.image_url} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                            <ShoppingBag className="w-8 h-8 text-gray-200" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between gap-2">
                             <h3 className="font-black text-[#001f3f] text-sm sm:text-base leading-tight uppercase line-clamp-2">{item.name}</h3>
                             <button
                                onClick={() => removeItem(item.lineId)}
                                className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                          {item.options && Object.entries(item.options).length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {Object.entries(item.options).map(([k, v]) => (
                                <span key={k} className="text-[9px] font-black bg-gray-50 text-[#001f3f]/60 px-2 py-1 rounded-md border border-gray-100 uppercase tracking-tighter">
                                  {v}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-4">
                           {/* Quantity */}
                           <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                              <button
                                onClick={() => updateQuantity(item.lineId, Math.max(1, item.quantity - 1))}
                                className="w-8 h-8 flex items-center justify-center text-[#001f3f] hover:bg-white rounded-lg transition-all shadow-sm active:scale-90"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-black text-[#001f3f] w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center text-[#001f3f] hover:bg-white rounded-lg transition-all shadow-sm active:scale-90"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                           </div>
                           <p className="text-[#d4af37] font-black text-sm sm:text-lg">
                             {(item.price * item.quantity).toFixed(2)} TND
                           </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 sm:p-8 bg-white border-t border-gray-100 shadow-[0_-20px_40px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('total')}</p>
                     <p className="text-3xl font-black text-[#001f3f] tracking-tighter">
                       {getTotalPrice().toFixed(2)} <span className="text-lg text-[#d4af37]">TND</span>
                     </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Livraison Gratuite</p>
                    <p className="text-[10px] font-bold text-gray-400">Taxes incluses</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="w-full py-5 bg-[#001f3f] text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-[#001f3f]/20 hover:bg-[#d4af37] hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 uppercase tracking-widest text-sm"
                  >
                    {t('proceedCheckout')}
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <Plus className="w-4 h-4 rotate-45" />
                    </motion.div>
                  </Link>
                  <button
                    onClick={closeCart}
                    className="w-full py-4 text-gray-400 font-bold hover:text-[#001f3f] transition-colors uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    Continuer mes achats
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
