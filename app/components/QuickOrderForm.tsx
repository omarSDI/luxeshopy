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
  const { t } = useLanguage();
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
      setError('Veuillez entrer un numéro de téléphone valide.');
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
          ph: phone.trim(), // simple hashing or hashing logic should be added for production
          fn: name.trim()
        }, {
          value: price,
          currency: 'TND',
          content_name: product.title
        });

        router.push(`/checkout/success?orderId=${res.data?.orderId}`);
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
    });
  };

  return (
    <div className="bg-[#0a0a0a] rounded-[2rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00FF41]/10 rounded-full blur-3xl group-hover:bg-[#00FF41]/20 transition-all duration-1000"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#00FF41]/20 rounded-xl flex items-center justify-center border border-[#00FF41]/30">
                <Zap className="w-6 h-6 text-[#00FF41] animate-pulse" />
            </div>
            <div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">COMMANDE RAPIDE</h3>
                <p className="text-[#00FF41] text-[10px] font-bold tracking-[0.2em] uppercase">Paiement à la livraison</p>
            </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
           <div className="space-y-4">
               <div className="relative">
                   <input
                       type="text"
                       placeholder="Nom complet"
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:border-[#00FF41]/50 focus:bg-white/10 outline-none transition-all"
                       required
                   />
               </div>
               <div className="relative">
                   <input
                       type="tel"
                       placeholder="Numéro de téléphone"
                       value={phone}
                       onChange={(e) => setPhone(e.target.value)}
                       className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:border-[#00FF41]/50 focus:bg-white/10 outline-none transition-all font-mono"
                       required
                   />
               </div>
               <div className="grid grid-cols-2 gap-4">
                   <select
                       value={governorate}
                       onChange={(e) => setGovernorate(e.target.value)}
                       className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-[#00FF41]/50 focus:bg-white/10 outline-none transition-all appearance-none"
                       required
                   >
                       <option value="" disabled className="bg-black">Ville</option>
                       {TUNISIAN_GOVERNORATES.map(gov => (
                           <option key={gov} value={gov} className="bg-black text-white">{gov}</option>
                       ))}
                   </select>
                   <input
                       type="text"
                       placeholder="Adresse"
                       value={city}
                       onChange={(e) => setCity(e.target.value)}
                       className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:border-[#00FF41]/50 focus:bg-white/10 outline-none transition-all"
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
             className="w-full py-5 bg-[#00FF41] text-black font-black text-lg rounded-2xl shadow-[0_0_30px_rgba(0,255,65,0.3)] hover:shadow-[0_0_50px_rgba(0,255,65,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group/btn"
           >
             {isPending ? (
               <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
             ) : (
               <>
                 ACHETER MAINTENANT
                 <CheckCircle className="w-6 h-6 group-hover/btn:rotate-12 transition-transform" />
               </>
             )}
           </button>

           <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                    <Truck className="w-4 h-4 text-[#00FF41]" />
                    Livraison Gratuite
                </div>
                <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4 text-[#00FF41]" />
                    Payer à la réception
                </div>
           </div>
        </form>
      </div>
    </div>
  );
}
