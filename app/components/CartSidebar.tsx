'use client';

import { useEffect, useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
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
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={closeCart}
          />

          {/* Sidebar — slides from right in LTR, from left in RTL */}
          <motion.div
            initial={{ x: isRTL ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed top-0 h-full w-full sm:w-[450px] bg-white shadow-2xl z-50 ${isRTL ? 'left-0' : 'right-0'}`}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b-2 border-[#d4af37]/30 bg-gradient-to-r from-[#001f3f] to-[#001f3f]">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6 text-[#d4af37]" />
                  <h2
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {t('shoppingCart')}
                  </h2>
                </div>
                <button
                  onClick={closeCart}
                  className="p-2 text-white hover:text-[#d4af37] hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-white to-[#d4af37]/5">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg mb-2 font-semibold">{t('cartEmpty')}</p>
                    <p className="text-gray-400 text-sm">{t('cartEmptySub')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.lineId}
                        initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-4 p-4 bg-white border-2 border-[#d4af37]/20 rounded-xl hover:border-[#d4af37] transition-all shadow-lg"
                      >
                        {/* Product Image Placeholder */}
                        <div className="w-20 h-20 bg-gradient-to-br from-[#001f3f] to-[#d4af37] rounded-lg flex-shrink-0 flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-white" />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-[#001f3f] truncate">{item.name}</h3>
                          <p className="text-[#d4af37] font-semibold text-sm mt-1">{item.price} TND</p>
                          {(item.size || item.color) && (
                            <p className="text-gray-500 text-xs mt-1">
                              {item.size ? `${t('sizes')} ${item.size}` : ''}
                              {item.size && item.color ? ' • ' : ''}
                              {item.color ? item.color : ''}
                            </p>
                          )}

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 mt-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                              className="p-1.5 text-[#001f3f] hover:text-white hover:bg-[#001f3f] transition-colors border-2 border-[#001f3f] rounded-lg"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4" />
                            </motion.button>
                            <span className="text-[#001f3f] font-bold w-8 text-center">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                              className="p-1.5 text-[#001f3f] hover:text-white hover:bg-[#001f3f] transition-colors border-2 border-[#001f3f] rounded-lg"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeItem(item.lineId)}
                              className="ms-auto p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors rounded-lg"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>

                          {/* Item Total */}
                          <p className="text-[#001f3f] font-bold mt-2 text-lg">
                            {(item.price * item.quantity).toFixed(2)} TND
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer with Total */}
              {items.length > 0 && (
                <div className="border-t-2 border-[#d4af37]/30 p-6 bg-gradient-to-r from-[#001f3f] to-[#001f3f] space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-white">{t('total')}:</span>
                    <span className="text-3xl font-bold text-[#d4af37]">
                      {getTotalPrice().toFixed(2)} TND
                    </span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="block w-full py-4 px-6 text-center bg-gradient-to-r from-[#d4af37] to-[#b8941e] text-[#001f3f] font-bold rounded-lg hover:shadow-xl hover:shadow-[#d4af37]/50 transition-all duration-300"
                  >
                    {t('proceedCheckout')}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
