'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductById } from '@/app/actions/products';
import { Product } from '@/lib/types';
import { useLanguage } from '@/app/context/LanguageContext';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  ShieldCheck, 
  Truck,
  Zap,
  Star
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import * as fbpixel from '@/lib/fpixel';
import QuickOrderForm from '@/app/components/QuickOrderForm';
import { InventoryCounter, LiveSalesPopup, StickyBuyBar } from '@/app/components/UrgencyComponents';

export default function ProductDetailPage() {
  const { t, dir } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewers, setViewers] = useState(0);

  useEffect(() => {
    async function loadProduct() {
      const data = await getProductById(productId);
      if (data) {
        setProduct(data);
        // Initialize options
        const initialOptions: Record<string, string> = {};
        if (data.options) {
          data.options.forEach((opt: any) => {
            if (opt.values && opt.values.length > 0) {
                initialOptions[opt.name] = opt.values[0];
            }
          });
        }
        setSelectedOptions(initialOptions);

        // Pixel: ViewContent
        fbpixel.event('ViewContent', {
            content_name: data.title,
            content_ids: [data.id],
            content_type: 'product',
            value: data.price,
            currency: 'TND'
        });
      }
      setLoading(false);
    }
    loadProduct();
    setViewers(Math.floor(Math.random() * 20) + 15);
  }, [productId]);

  const currentVariant = useMemo(() => {
    if (!product?.variants) return null;
    return product.variants.find(v => 
      Object.entries(selectedOptions).every(([k, val]) => v.options[k] === val)
    );
  }, [product, selectedOptions]);

  // Update gallery when variant changes
  useEffect(() => {
    if (currentVariant?.image_url && (product?.images || product?.image_url)) {
      const allImgs = (product.images && product.images.length > 0 ? product.images : [product.image_url]).filter(Boolean) as string[];
      const idx = allImgs.findIndex(img => img === currentVariant.image_url);
      if (idx !== -1) setCurrentImageIndex(idx);
    }
  }, [currentVariant, product]);

  const scrollToCheckout = () => {
    const el = document.getElementById('quick-order');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (!product) return (
    <div className="min-h-screen bg-white text-[#001f3f] flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-extrabold uppercase mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>PRODUIT NON TROUVÉ</h1>
        <Link href="/shop" className="px-8 py-4 bg-[#001f3f] text-white font-bold rounded-2xl uppercase tracking-widest shadow-xl">RETOUR À LA BOUTIQUE</Link>
    </div>
  );

  const images = (product.images && product.images.length > 0 ? product.images : [product.image_url]).filter(Boolean) as string[];
  const price = currentVariant?.price || product.price;

  return (
    <div className="min-h-screen bg-white text-[#001f3f] pb-20">
      <Navbar />
      <LiveSalesPopup />
      <StickyBuyBar price={price} onBuy={scrollToCheckout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#d4af37] transition-colors mb-8 group font-bold tracking-tight text-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t('backToShop')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 mb-20">
          {/* Visual Gallery Section */}
          <div className="space-y-6">
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 group/gallery shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={images[currentImageIndex] || ''}
                  alt={product.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                  onError={(e: any) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1546868871-70c122467d9b?q=80&w=800';
                  }}
                />
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button 
                    onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-[#d4af37] hover:text-white backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg transition-all opacity-0 group-hover/gallery:opacity-100"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-[#d4af37] hover:text-white backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg transition-all opacity-0 group-hover/gallery:opacity-100"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative flex-shrink-0 w-24 aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    currentImageIndex === idx ? 'border-[#d4af37] shadow-xl scale-105' : 'border-transparent grayscale opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img || ''} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Checkout & Decision Section */}
          <div className="flex flex-col">
            <div className="space-y-6 mb-10">
              <div className="flex items-center gap-4">
                <span className="px-4 py-1 bg-gray-100 text-[#001f3f] rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-200">
                  {t('exclusiveEdition')}
                </span>
                <span className="flex items-center gap-1.5 text-gray-400 text-xs font-bold">
                  <TrendingUp className="w-3.5 h-3.5 text-[#d4af37]" />
                  {viewers} {t('viewingNow')}
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-extrabold text-[#001f3f] tracking-tight leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                {product.title}
              </h1>

              <div className="flex items-baseline gap-6">
                <p className="text-4xl font-black text-[#d4af37]">
                  {price.toFixed(2)} TND
                </p>
                {product.compare_at_price !== undefined && Number(product.compare_at_price) > 0 && (
                  <p className="text-xl text-gray-300 line-through font-bold">
                    {Number(product.compare_at_price).toFixed(2)} TND
                  </p>
                )}
              </div>

              <InventoryCounter 
                stock={currentVariant?.stock ?? product.stock} 
                variantName={selectedOptions['Color'] || selectedOptions['Model']} 
              />
            </div>

            {/* Dynamic Option Selectors */}
            {product.options && (product.options as any[]).map((option) => (
              <div key={option.name} className="mb-8">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                  SÉLECTIONNEZ {option.name}
                </p>
                <div className="flex flex-wrap gap-3">
                  {option.values.map((val: string) => {
                    const isActive = selectedOptions[option.name] === val;
                    return (
                      <button
                        key={val}
                        onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: val }))}
                        className={`px-8 py-3 rounded-xl text-xs font-bold uppercase transition-all duration-300 border-2 ${
                          isActive 
                          ? 'bg-[#001f3f] text-white border-[#001f3f] shadow-lg scale-105' 
                          : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div id="quick-order" className="mt-4">
              <QuickOrderForm product={product} variant={currentVariant} />
            </div>

            {/* Trust Signals */}
            <div className="mt-12 p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100 grid grid-cols-2 gap-8">
               <div className="space-y-2">
                  <ShieldCheck className="w-6 h-6 text-[#d4af37] mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#001f3f]">{t('authenticityTitle')}</p>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{t('authenticityDesc')}</p>
               </div>
               <div className="space-y-2">
                  <Truck className="w-6 h-6 text-[#d4af37] mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#001f3f]">{t('expressDelivery')}</p>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{t('deliveryDesc')}</p>
               </div>
            </div>
          </div>
        </div>

        {/* Extended Description */}
        <div className="border-t border-gray-100 pt-20">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-[#001f3f] mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>DESCRIPTION DÉTAILLÉE</h2>
            <div className="prose prose-slate max-w-none text-gray-600 font-medium leading-relaxed">
              {product.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
