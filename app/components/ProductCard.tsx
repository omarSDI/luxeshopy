'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, ShoppingCart, TrendingUp } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Product } from '@/lib/types';
import QuickViewModal from './QuickViewModal';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [viewers] = useState(Math.floor(Math.random() * 15) + 1);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const { t } = useLanguage();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.title,
      price: product.price,
    });
    openCart();
  };

  const isLimitedStock = Math.random() > 0.7;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group relative"
      >
        <Link
          href={`/products/${product.id}`}
          className="block bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:border-[#d4af37]/50 transition-all duration-500 shadow-sm hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image Container */}
          <div className="relative w-full aspect-[4/5] bg-[#f9f9f9] overflow-hidden">
            {product.image_url ? (
                <div className="relative w-full h-full">
                    {/* Glass Overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                    
                    <motion.img
                        src={product.image_url}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        animate={{ scale: isHovered ? 1.05 : 1 }}
                        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                        onError={(e: any) => {
                            e.target.src = 'https://images.unsplash.com/photo-1546868871-70c122467d9b?q=80&w=800'; // Fallback to a nice generic product image
                        }}
                    />
                </div>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 gap-2">
                    <ShoppingCart className="w-10 h-10 text-gray-200" />
                    <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest">{t('noImage')}</span>
                </div>
            )}

            {/* Badges Overlay */}
            <div className="absolute inset-x-4 top-4 flex justify-between items-start z-20 pointer-events-none">
                <div className="flex flex-col gap-2">
                    {product.category && (
                        <span className="px-3 py-1 bg-[#0a0a0a] text-[#d4af37] text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl">
                            {product.category}
                        </span>
                    )}
                    {isLimitedStock && (
                        <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                            {t('limitedStock')}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-white/20">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-[#0a0a0a] tracking-widest uppercase">
                        {viewers} {t('viewing')}
                    </span>
                </div>
            </div>

            {/* Premium Button Overlay */}
            <div className="absolute inset-x-6 bottom-6 flex justify-center z-20">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                    transition={{ duration: 0.3 }}
                >
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowQuickView(true);
                        }}
                        className="px-6 py-3 bg-white/90 backdrop-blur-xl text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl hover:bg-[#d4af37] hover:text-white transition-all duration-300 border border-white/20"
                    >
                        {t('quickView')}
                    </button>
                </motion.div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="p-6 space-y-4 bg-white relative">
            <div className="space-y-1">
              <p className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.3em] mb-1">
                {product.category || 'Luxury Item'}
              </p>
              <h3
                className="text-lg font-bold text-[#0a0a0a] line-clamp-1 group-hover:text-[#d4af37] transition-colors"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {product.title}
              </h3>
            </div>

            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Pricing</span>
                <p className="text-2xl font-black text-[#0a0a0a] tracking-tighter">
                  {product.price.toFixed(2)} <span className="text-sm font-bold text-gray-400 ml-1">TND</span>
                </p>
              </div>
              
              <button
                onClick={handleAddToCart}
                className="w-12 h-12 bg-[#0a0a0a] hover:bg-[#d4af37] text-white rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-[#d4af37]/30 group/btn"
              >
                <ShoppingCart className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </Link>
      </motion.div>

      {showQuickView && (
        <QuickViewModal
          product={product}
          onClose={() => setShowQuickView(false)}
        />
      )}
    </>
  );
}
