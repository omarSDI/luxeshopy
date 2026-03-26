'use client';

import { useEffect, useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowLeft, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useLanguage } from '../context/LanguageContext';
import { getShippingFee } from '@/app/actions/settings';
import Link from 'next/link';

export default function CartSidebar() {
  const [mounted, setMounted] = useState(false);
  const [shippingConfig, setShippingConfig] = useState({ amount: 7, free_threshold: 0 });
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getTotalPrice,
  } = useCartStore();
  const { t, isRTL, dir } = useLanguage();

  useEffect(() => {
    setMounted(true);
    const fetchShipping = async () => {
      const config = await getShippingFee();
      if (config) setShippingConfig(config);
    };
    fetchShipping();
  }, []);

  if (!mounted) return null;

  const subtotal = getTotalPrice();
  const isFreeShipping = shippingConfig.free_threshold > 0 && subtotal >= shippingConfig.free_threshold;
  const currentShippingFee = isFreeShipping ? 0 : shippingConfig.amount;
  const finalTotal = subtotal + currentShippingFee;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden" dir={dir}>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#001f3f]/40 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Sidebar */}
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
                    {items.length} {items.length === 1 ? t('cartItem') : t('cartItems')}
                  </p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="group flex items-center gap-2 p-2 px-3 bg-gray-50 hover:bg-[#001f3f] text-[#001f3f] hover:text-white rounded-2xl transition-all duration-300 border border-gray-100"
              >
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
                  <button onClick={closeCart} className="px-8 py-3 bg-[#001f3f] text-white rounded-xl font-bold">
                    {t('exploreCollection')}
                  </button>
                </div>
              ) : (
                items.map((item) => (
                    <div key={item.lineId} className="flex gap-4 p-4 bg-white border border-gray-50 rounded-[1.5rem] shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-[#001f3f] text-sm line-clamp-1">{item.name}</h4>
                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-3 bg-gray-50 px-2 py-1 rounded-lg">
                                    <button onClick={() => updateQuantity(item.lineId, Math.max(1, item.quantity - 1))}><Minus className="w-3 h-3"/></button>
                                    <span className="text-xs font-bold">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.lineId, item.quantity + 1)}><Plus className="w-3 h-3"/></button>
                                </div>
                                <span className="font-black text-[#d4af37]">{(item.price * item.quantity).toFixed(2)} TND</span>
                            </div>
                        </div>
                    </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 sm:p-8 bg-gray-50 border-t border-gray-100">
                <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm font-bold text-gray-500">
                        <span>{t('total')}</span>
                        <span>{subtotal.toFixed(2)} TND</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold">
                        <span className="flex items-center gap-2"><Truck className="w-4 h-4"/> Delivery</span>
                        {isFreeShipping ? (
                            <span className="text-emerald-500">{t('freeDelivery')}</span>
                        ) : (
                            <span>{shippingConfig.amount.toFixed(2)} TND</span>
                        )}
                    </div>
                    <div className="flex justify-between items-end pt-2 border-t border-gray-200">
                        <p className="text-3xl font-black text-[#001f3f]">{finalTotal.toFixed(2)} <span className="text-sm font-bold text-[#d4af37]">TND</span></p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">{t('taxesIncluded')}</p>
                    </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full py-5 bg-[#001f3f] text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:bg-[#d4af37] transition-all uppercase tracking-widest text-sm"
                >
                  {t('proceedCheckout')}
                </Link>
                <button onClick={closeCart} className="w-full py-4 text-gray-400 font-bold uppercase text-[10px] flex items-center justify-center gap-2 mt-2">
                    <ArrowLeft className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
                    {t('backToCollection')}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
