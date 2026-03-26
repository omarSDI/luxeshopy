'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Truck, ShieldCheck, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { createOrder } from '@/app/actions/orders';
import { trackServerEvent } from '@/app/actions/capi';
import * as fbpixel from '@/lib/fpixel';

interface QuickOrderFormProps {
  product: any;
  variant?: any;
}

export default function QuickOrderForm({ product, variant }: QuickOrderFormProps) {
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [hasStarted, setHasStarted] = useState(false);

  const price = variant?.price || product.price;

  const TUNISIAN_GOVERNORATES = [
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba',
    'Kairouan', 'Kasserine', 'Kebili', 'Kef', 'Mahdia', 'Manouba', 'Medenine',
    'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse',
    'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
  ];

  // Track InitiateCheckout on first interaction
  useEffect(() => {
    if ((name || phone || city) && !hasStarted) {
      setHasStarted(true);
      fbpixel.event('InitiateCheckout', {
        content_name: product.title,
        content_ids: [product.id],
        content_type: 'product',
        value: price,
        currency: 'TND'
      });
      // Server-side CAPI
      trackServerEvent('InitiateCheckout', {}, {
        content_name: product.title,
        value: price,
        currency: 'TND'
      });
    }
  }, [name, phone, city, hasStarted, product, price]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (phone.length < 8) {
      setError(t('invalidPhone'));
      return;
    }

    startTransition(async () => {
      const orderData = {
        customer_name: name.trim(),
        phone: phone.trim(),
        address: `${city.trim()}, ${governorate}`,
        total_price: price,
        items: [{
          id: product.id,
          name: product.title,
          price: price,
          quantity: 1,
          variantId: variant?.id,
          options: variant?.options,
          image_url: (variant?.image_url || product.image_url) as string
        }]
      };

      const res = await createOrder(orderData);

      if (res.success) {
        // Pixel Tracking
        fbpixel.event('Purchase', {
          value: price,
          currency: 'TND',
          content_name: product.title,
          content_ids: [product.id]
        });

        // CAPI Tracking
        trackServerEvent('Purchase', {
          ph: phone.trim(), 
          fn: name.trim()
        }, {
          value: price,
          currency: 'TND',
          content_name: product.title
        });

        router.push(`/checkout/success?orderId=${res.data?.orderId}`);
      } else {
        setError(t('orderError'));
      }
    });
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-gray-100 shadow-xl relative overflow-hidden group">
      {/* Subtle Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#d4af37]/5 rounded-full blur-3xl group-hover:bg-[#d4af37]/10 transition-all duration-1000"></div>

      <div className="relative z-10 font-[Inter,sans-serif]" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-inner">
                <Zap className="w-7 h-7 text-[#d4af37] fill-[#d4af37]/20" />
            </div>
            <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#001f3f] italic uppercase tracking-tighter" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {t('quickOrderTitle')}
                </h3>
                <p className="text-[#d4af37] text-[10px] font-black tracking-[0.3em] uppercase">
                    {t('paymentOnDelivery')}
                </p>
            </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
           <div className="space-y-4">
               <div className="relative">
                   <input
                       type="text"
                       placeholder={t('fullName')}
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-[#001f3f] placeholder:text-gray-400 focus:border-[#d4af37] focus:bg-white focus:ring-4 focus:ring-[#d4af37]/5 outline-none transition-all font-semibold"
                       required
                   />
               </div>
               <div className="relative">
                   <input
                       type="tel"
                       placeholder={t('phoneNumber')}
                       value={phone}
                       onChange={(e) => setPhone(e.target.value)}
                       className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-[#001f3f] placeholder:text-gray-400 focus:border-[#d4af37] focus:bg-white focus:ring-4 focus:ring-[#d4af37]/5 outline-none transition-all font-bold"
                       required
                   />
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <select
                       value={governorate}
                       onChange={(e) => setGovernorate(e.target.value)}
                       className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-[#001f3f] focus:border-[#d4af37] focus:bg-white outline-none transition-all appearance-none font-semibold"
                       required
                   >
                       <option value="" disabled className="bg-white">{t('governorate')}</option>
                       {TUNISIAN_GOVERNORATES.map(gov => (
                           <option key={gov} value={gov} className="bg-white text-[#001f3f]">{gov}</option>
                       ))}
                   </select>
                   <input
                       type="text"
                       placeholder={t('city')}
                       value={city}
                       onChange={(e) => setCity(e.target.value)}
                       className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-[#001f3f] placeholder:text-gray-400 focus:border-[#d4af37] focus:bg-white focus:ring-4 focus:ring-[#d4af37]/5 outline-none transition-all font-semibold"
                       required
                   />
               </div>
           </div>

           {error && (
             <p className="text-red-500 text-xs font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>
           )}

           <button
             type="submit"
             disabled={isPending}
             className="w-full py-5 bg-[#001f3f] text-white font-black text-lg rounded-[1.5rem] shadow-xl hover:bg-[#d4af37] hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 flex items-center justify-center gap-3 group/btn"
           >
             {isPending ? (
               <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
             ) : (
               <>
                 <span className="uppercase">{t('buyNow')}</span>
                 <CheckCircle className="w-6 h-6 group-hover/btn:rotate-12 transition-transform" />
               </>
             )}
           </button>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 mt-4">
                <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] leading-none">
                    <Truck className="w-4 h-4 text-[#d4af37]" />
                    {t('freeDeliveryLabel')}
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] leading-none">
                    <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                    {t('payAtReceiptLabel')}
                </div>
           </div>
        </form>
      </div>
    </div>
  );
}
