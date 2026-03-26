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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (!product) return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-black italic uppercase mb-8">PRODUCT NOT FOUND</h1>
        <Link href="/shop" className="px-8 py-4 bg-[#d4af37] text-black font-black rounded-2xl uppercase tracking-widest">BACK TO SHOP</Link>
    </div>
  );

  const images = (product.images && product.images.length > 0 ? product.images : [product.image_url]).filter(Boolean) as string[];
  const price = currentVariant?.price || product.price;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#d4af37] selection:text-black pb-20">
      <Navbar />
      <LiveSalesPopup />
      <StickyBuyBar price={price} onBuy={scrollToCheckout} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-2 text-white/40 hover:text-[#d4af37] transition-colors mb-12 group uppercase font-black tracking-widest text-[10px]"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          RETOUR À LA BOUTIQUE
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 mb-20">
          {/* Visual Gallery Section */}
          <div className="space-y-6">
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/10 group/gallery shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={images[currentImageIndex] || ''}
                  alt={product.title}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover"
                  onError={(e: any) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1546868871-70c122467d9b?q=80&w=800';
                  }}
                />
              </AnimatePresence>

              {/* Video Overlay Badge (Simulated) */}
              <div className="absolute top-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2">
                 <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                 <span className="text-[10px] font-black italic uppercase">HD VIDEO SHOWCASE</span>
              </div>

              {images.length > 1 && (
                <>
                  <button 
                    onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/40 hover:bg-[#d4af37] hover:text-black backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 transition-all opacity-0 group-hover/gallery:opacity-100"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/40 hover:bg-[#d4af37] hover:text-black backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 transition-all opacity-0 group-hover/gallery:opacity-100"
                  >
                    <ChevronRight className="w-6 h-6" />
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
                    currentImageIndex === idx ? 'border-[#d4af37] scale-105 shadow-[0_0_15px_rgba(0,255,65,0.3)]' : 'border-white/10 grayscale opacity-40 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={img || ''} 
                    alt="" 
                    className="w-full h-full object-cover" 
                    onError={(e: any) => {
                      e.target.src = 'https://images.unsplash.com/photo-1546868871-70c122467d9b?q=80&w=800';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Checkout & Decision Section */}
          <div className="flex flex-col">
            <div className="space-y-6 mb-10">
              <div className="flex items-center gap-3">
                <span className="px-5 py-1.5 bg-[#d4af37]/10 text-[#d4af37] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#d4af37]/20">
                  Édition Limitée
                </span>
                <span className="flex items-center gap-1.5 text-white/40 text-[10px] font-black uppercase tracking-widest">
                  <TrendingUp className="w-3 h-3 text-[#d4af37]" />
                  {viewers} Visionnent
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter leading-none">
                {product.title}
              </h1>

              <div className="flex items-baseline gap-6">
                <p className="text-5xl font-black text-[#d4af37] tracking-tighter italic">
                  {price.toFixed(2)} TND
                </p>
                {product.compare_at_price !== undefined && Number(product.compare_at_price) > 0 && (
                  <p className="text-2xl text-white/30 line-through font-bold opacity-40 italic">
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
              <div key={option.name} className="mb-10">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">
                  SÉLECTIONNEZ {option.name}
                </p>
                <div className="flex flex-wrap gap-3">
                  {option.values.map((val: string) => {
                    const isActive = selectedOptions[option.name] === val;
                    return (
                      <button
                        key={val}
                        onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: val }))}
                        className={`px-8 py-4 rounded-2xl text-xs font-black uppercase transition-all duration-300 border-2 ${
                          isActive 
                          ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                          : 'bg-transparent text-white border-white/10 hover:border-white/40'
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div id="quick-order" className="mt-4 animate-fade-in">
              <QuickOrderForm product={product} variant={currentVariant} />
            </div>

            {/* High-Tech Trust Banner */}
            <div className="mt-12 p-8 rounded-[2rem] bg-white/5 border border-white/10 grid grid-cols-2 gap-8">
               <div className="space-y-2">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                    <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#d4af37]">AUTHENTICITÉ</p>
                  <p className="text-[10px] text-white/40 leading-relaxed">Produits 100% originaux dans leur emballage d'origine.</p>
               </div>
               <div className="space-y-2">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                    <Truck className="w-5 h-5 text-[#d4af37]" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#d4af37]">EXPÉDITION</p>
                  <p className="text-[10px] text-white/40 leading-relaxed">Livraison express dans toute la Tunisie sous 24/48h.</p>
               </div>
            </div>
          </div>
        </div>

        {/* Extended Description / Specs */}
        <div className="border-t border-white/10 pt-20">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8">SPÉCIFICATIONS TECHNIQUES</h2>
            <div className="prose prose-invert max-w-none text-white/60 font-bold leading-relaxed text-sm lg:text-base">
              {product.description || "Une ingénierie de précision rencontre une esthétique futuriste. Ce produit est conçu pour ceux qui exigent l'excellence à chaque instant."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
