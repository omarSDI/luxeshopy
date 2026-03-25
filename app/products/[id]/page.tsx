'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getProductById } from '@/app/actions/products';
import { Product } from '@/lib/types';
import { useCartStore } from '../../store/cartStore';
import Navbar from '../../components/Navbar';
import CartSidebar from '../../components/CartSidebar';
import { ArrowLeft, ShoppingCart, Crown, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function ProductDetailPage() {
  const { t, dir } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [mounted, setMounted] = useState(false);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [viewers, setViewers] = useState(Math.floor(Math.random() * 15) + 1);

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProductById(productId);
        setProduct(data);
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setLoading(false);
      }
    }
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (!selectedSize || !product) return;

    addItem(
      {
        id: product.id,
        name: product.title,
        price: product.price,
      },
      {
        size: selectedSize,
        color: selectedColor ?? product.color ?? undefined,
      }
    );
    openCart();
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#d4af37]/5">
        <Navbar />
        <CartSidebar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="skeleton h-[600px] rounded-2xl"></div>
            <div className="space-y-6">
              <div className="skeleton h-12 w-3/4 rounded"></div>
              <div className="skeleton h-8 w-1/2 rounded"></div>
              <div className="skeleton h-32 w-full rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#d4af37]/5">
        <Navbar />
        <CartSidebar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-[#001f3f] mb-4">{t('productNotFound')}</h1>
          <button
            onClick={() => router.push('/')}
            className="text-[#001f3f] hover:text-[#d4af37] transition-colors font-semibold"
          >
            {t('returnHome')}
          </button>
        </div>
      </div>
    );
  }

  const isLimitedStock = Math.random() > 0.7;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#d4af37]/5">
      <Navbar />
      <CartSidebar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#001f3f] hover:text-[#d4af37] transition-colors mb-8 font-semibold group"
        >
          <ArrowLeft className={`w-5 h-5 ${dir === 'rtl' ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:-translate-x-1'} transition-transform`} />
          <span>{t('backToCollection')}</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Images with Parallax */}
          <motion.div
            initial={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="relative w-full aspect-square bg-gradient-to-br from-[#001f3f]/10 to-[#d4af37]/10 rounded-3xl overflow-hidden border-2 border-[#d4af37]/20 shadow-2xl">
              {product.image_url ? (
                <motion.img
                  src={product.image_url}
                  alt={product.title}
                  className="h-full w-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Crown className="w-32 h-32 text-[#d4af37]/30" />
                </div>
              )}

              {/* Badges */}
              <div className={`absolute top-6 ${dir === 'rtl' ? 'right-6' : 'left-6'} flex flex-col gap-2`}>
                {isLimitedStock && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full shadow-lg animate-pulse"
                  >
                    {t('limitedStock')}
                  </motion.span>
                )}
                {product.category && (
                  <span className="px-4 py-2 bg-[#001f3f] text-[#d4af37] text-sm font-semibold rounded-full capitalize shadow-lg">
                    {product.category}
                  </span>
                )}
              </div>

              {/* Viewers Badge */}
              <div className={`absolute top-6 ${dir === 'rtl' ? 'left-6' : 'right-6'} flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg`}>
                <TrendingUp className="w-4 h-4 text-[#d4af37]" />
                <span className="text-sm font-semibold text-[#001f3f]">
                  {viewers} {t('viewing')}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: dir === 'rtl' ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8 text-start"
          >
            <div>
              <h1
                className="text-4xl md:text-5xl font-bold text-[#001f3f] mb-4"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {product.title}
              </h1>
              <div className="flex items-baseline gap-4">
                <p className="text-4xl font-bold text-[#d4af37]">
                  {product.price.toFixed(2)} TND
                </p>
                {product.category && (
                  <span className="px-3 py-1 bg-[#001f3f] text-[#d4af37] text-sm font-semibold rounded-full capitalize">
                    {product.category}
                  </span>
                )}
              </div>
            </div>

            {/* Color Selection */}
            {product.color && (
              <div>
                <h3 className="text-lg font-semibold text-[#001f3f] mb-3 uppercase tracking-wider">
                  {t('color')}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedColor(product.color!)}
                  className={`px-8 py-3 border-2 rounded-lg font-semibold transition-all duration-300 ${selectedColor === product.color
                      ? 'border-[#d4af37] bg-[#d4af37] text-[#001f3f] shadow-lg'
                      : 'border-[#d4af37]/30 text-[#001f3f] hover:border-[#d4af37] hover:bg-[#d4af37]/10'
                    }`}
                >
                  {product.color}
                </motion.button>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-[#001f3f] mb-4 uppercase tracking-wider">
                  {t('sizes')} <span className="text-[#d4af37]">*</span>
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {product.sizes.map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(size)}
                      className={`py-4 px-4 border-2 rounded-lg font-bold transition-all duration-300 ${selectedSize === size
                          ? 'border-[#d4af37] bg-[#d4af37] text-[#001f3f] shadow-lg'
                          : 'border-[#d4af37]/30 text-[#001f3f] hover:border-[#d4af37] hover:bg-[#d4af37]/10'
                        }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Button with Magnet Effect */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className={`w-full py-5 px-6 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-xl ${selectedSize
                  ? 'bg-gradient-to-r from-[#001f3f] to-[#001f3f] hover:from-[#d4af37] hover:to-[#b8941e] text-white hover:text-[#001f3f] hover:shadow-2xl hover:shadow-[#d4af37]/50'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              {selectedSize ? (
                <>
                  <ShoppingCart className="w-6 h-6" />
                  {t('addToCart')}
                </>
              ) : (
                t('selectSize')
              )}
            </motion.button>

            {/* Product Description */}
            {product.description && (
              <div className="pt-8 border-t-2 border-[#d4af37]/20">
                <h3
                  className="text-2xl font-bold text-[#001f3f] mb-4"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {t('productDescriptionTitle')}
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>
            )}

            {/* Shipping Info */}
            <div className="pt-8 border-t-2 border-[#d4af37]/20">
              <h3
                className="text-2xl font-bold text-[#001f3f] mb-4"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {t('shippingInformation')}
              </h3>
              <div className="space-y-3 text-gray-700">
                <p>
                  <span className="font-bold text-[#001f3f]">{t('freeShipping')}:</span> {t('freeShippingDesc')}
                </p>
                <p>
                  <span className="font-bold text-[#001f3f]">{t('standardShipping')}:</span> {t('standardShippingDesc')}
                </p>
                <p>
                  <span className="font-bold text-[#001f3f]">{t('expressShipping')}:</span> {t('expressShippingDesc')}
                </p>
                <p>
                  <span className="font-bold text-[#001f3f]">{t('returns')}:</span> {t('returnsDesc')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
