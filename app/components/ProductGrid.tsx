'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import { useLanguage } from '../context/LanguageContext';

const CATEGORIES = ['all', 'new-tech', 'wearables', 'accessories'] as const;
type CategoryFilter = typeof CATEGORIES[number];

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  en: { all: 'All', 'new-tech': 'New Tech', wearables: 'Wearables', accessories: 'Accessories' },
  fr: { all: 'Tous', 'new-tech': 'Nouvelle Tech', wearables: 'Connectés', accessories: 'Accessoires' },
  ar: { all: 'الكل', 'new-tech': 'تكنولوجيا', wearables: 'أجهزة ملبوسة', accessories: 'إكسسوارات' },
};

const SECTION_LABELS: Record<string, { title: string; subtitle: string; noProducts: string; noProductsSub: string }> = {
  en: {
    title: 'Featured Collection',
    subtitle: 'Discover our curated selection of premium products',
    noProducts: 'No products available',
    noProductsSub: 'Check back soon for our latest collection',
  },
  fr: {
    title: 'Collection Vedette',
    subtitle: 'Découvrez notre sélection de produits premium',
    noProducts: 'Aucun produit disponible',
    noProductsSub: 'Revenez bientôt pour notre nouvelle collection',
  },
  ar: {
    title: 'المجموعة المميزة',
    subtitle: 'اكتشف تشكيلتنا المختارة من أفضل المنتجات',
    noProducts: 'لا توجد منتجات',
    noProductsSub: 'تصفح مجددًا قريبًا لمشاهدة أحدث مجموعاتنا',
  },
};

export default function ProductGrid({ products }: { products: Product[] }) {
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const { language } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  const labels = SECTION_LABELS[language] ?? SECTION_LABELS.en;
  const catLabels = CATEGORY_LABELS[language] ?? CATEGORY_LABELS.en;

  const filtered = activeFilter === 'all'
    ? products
    : products.filter((p) => p.category === activeFilter);

  if (!mounted) {
    return (
      <section className="w-full bg-gradient-to-b from-white to-[#d4af37]/5 pt-6 pb-20 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="skeleton h-10 w-72 mx-auto mb-6 rounded" />
          <div className="skeleton h-8 w-full max-w-md mx-auto mb-12 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gradient-to-b from-white to-[#d4af37]/5 pt-6 pb-20 md:pb-32 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl md:text-5xl font-bold text-[#001f3f] mb-3"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {labels.title}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mb-4" />
          <p className="text-gray-500 text-base md:text-lg">{labels.subtitle}</p>
        </div>

        {/* Category Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <SlidersHorizontal className="w-4 h-4 text-[#d4af37] hidden sm:block" />
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${
                activeFilter === cat
                  ? 'bg-[#d4af37] border-[#d4af37] text-[#001f3f] shadow-md'
                  : 'bg-white border-[#d4af37]/30 text-[#001f3f] hover:border-[#d4af37] hover:bg-[#d4af37]/10'
              }`}
            >
              {catLabels[cat]}
            </motion.button>
          ))}
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="flex justify-center items-center py-24">
            <div className="text-center">
              <p className="text-gray-500 text-lg mb-2 font-semibold">{labels.noProducts}</p>
              <p className="text-gray-400 text-sm">{labels.noProductsSub}</p>
            </div>
          </div>
        ) : (
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {filtered.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
