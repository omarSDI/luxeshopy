'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '../store/cartStore';
import { Product } from '@/lib/types';
import { useLanguage } from '../context/LanguageContext';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const { t } = useLanguage();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.title,
      price: product.price,
    });
    openCart();
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 end-4 p-2 text-gray-500 hover:text-[#001f3f] hover:bg-gray-100 rounded-full transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Image */}
            <div className="relative h-96 rounded-lg overflow-hidden bg-gradient-to-br from-[#001f3f]/5 to-[#d4af37]/5">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">{t('noImage')}</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <h2
                  className="text-3xl font-bold text-[#001f3f] mb-4"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {product.title}
                </h2>

                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold text-[#d4af37]">
                    {product.price.toFixed(2)} TND
                  </span>
                  {product.category && (
                    <span className="px-3 py-1 bg-[#001f3f] text-[#d4af37] text-sm font-semibold rounded-full capitalize">
                      {product.category}
                    </span>
                  )}
                </div>

                {product.description && (
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-[#001f3f] to-[#001f3f] hover:from-[#d4af37] hover:to-[#d4af37] text-white hover:text-[#001f3f] rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {t('addToCart')}
                </motion.button>
                <Link
                  href={`/products/${product.id}`}
                  onClick={onClose}
                  className="flex-1 py-4 px-6 border-2 border-[#001f3f] text-[#001f3f] hover:bg-[#001f3f] hover:text-white rounded-lg font-semibold transition-all duration-300 text-center"
                >
                  {t('viewDetails')}
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
