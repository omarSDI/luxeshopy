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

          <div className="grid md:grid-cols-2 gap-10 p-10">
            {/* Image Section */}
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-[#f9f9f9] border border-gray-100 shadow-inner">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e: any) => {
                    e.target.src = 'https://images.unsplash.com/photo-1546868871-70c122467d9b?q=80&w=800';
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gray-50 gap-3">
                  <ShoppingCart className="w-12 h-12 text-gray-200" />
                  <span className="text-gray-400 text-xs font-black uppercase tracking-widest">{t('noImage')}</span>
                </div>
              )}
              
              {product.category && (
                <div className="absolute top-6 left-6 px-4 py-1.5 bg-[#0a0a0a] text-[#d4af37] text-[10px] font-black uppercase tracking-widest rounded-full shadow-2xl">
                    {product.category}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <p className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.4em]">
                    Premium Collection
                </p>
                <h2
                  className="text-4xl lg:text-5xl font-bold text-[#0a0a0a] leading-tight"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {product.title}
                </h2>

                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-black text-[#0a0a0a] tracking-tighter">
                    {product.price.toFixed(2)}
                  </span>
                  <span className="text-lg font-bold text-gray-400 uppercase tracking-widest">
                    TND
                  </span>
                </div>

                <div className="w-20 h-1.5 bg-[#d4af37] rounded-full" />

                {product.description && (
                  <p className="text-gray-500 leading-relaxed text-sm font-medium">
                    {product.description}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="flex-1 py-5 px-8 bg-[#0a0a0a] text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl hover:bg-[#d4af37] transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {t('addToCart')}
                </motion.button>
                <Link
                  href={`/products/${product.id}`}
                  onClick={onClose}
                  className="flex-1 py-5 px-8 border-2 border-gray-100 text-[#0a0a0a] hover:border-[#d4af37] hover:text-[#d4af37] rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all duration-300 text-center"
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
