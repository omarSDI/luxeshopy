'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { createProduct, updateProduct } from '@/app/actions/products';
import { Product, ProductOption, ProductVariant } from '@/lib/types';
import { supabase } from '@/lib/supabase/client';
import { 
  Upload, 
  Link as LinkIcon, 
  X, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  GripVertical, 
  Star, 
  Check,
  LayoutGrid,
  Layers,
  Database
} from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';

interface ProductFormProps {
  product?: Product;
}

const CATEGORIES = ['Men', 'Women', 'Accessories', 'New Tech', 'Wearables'];

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- State Management ---
  const [formData, setFormData] = useState({
    title: product?.title || '',
    description: product?.description || '',
    category: product?.category || '',
    price: product?.price || 0,
    compare_at_price: (product as any)?.compare_at_price || 0,
    cost_price: (product as any)?.cost_price || 0,
    image_url: product?.image_url || '', // Main/Cover Image
    image_type: (product as any)?.image_type || 'url',
  });

  // Multi-image gallery
  const [gallery, setGallery] = useState<{ url: string; file?: File; type: 'url' | 'upload' }[]>(
    product?.images?.map(url => ({ url, type: 'url' })) || []
  );

  // Options (e.g., Color: [Red, Blue])
  const [options, setOptions] = useState<ProductOption[]>(product?.options || []);
  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionValue, setNewOptionValue] = useState('');

  // Variants (auto-generated)
  const [variants, setVariants] = useState<ProductVariant[]>(product?.variants || []);

  // --- Variant Generation Logic ---
  const generateVariants = (currentOptions: ProductOption[]) => {
    if (currentOptions.length === 0) return [];

    const generate = (index: number, current: Record<string, string>): any[] => {
      if (index === currentOptions.length) {
        // Find existing variant for this combination to preserve data
        const existing = variants.find(v => 
          JSON.stringify(v.options) === JSON.stringify(current)
        );
        
        return [{
          id: existing?.id || Math.random().toString(36).substr(2, 9),
          options: { ...current },
          price: existing?.price || formData.price,
          stock: existing?.stock || 100,
          image_url: existing?.image_url || formData.image_url
        }];
      }

      let results: any[] = [];
      const option = currentOptions[index];
      for (const value of option.values) {
        results = results.concat(generate(index + 1, { ...current, [option.name]: value }));
      }
      return results;
    };

    return generate(0, {});
  };

  useEffect(() => {
    if (options.length > 0) {
      const newVariants = generateVariants(options);
      setVariants(newVariants);
    } else {
      setVariants([]);
    }
  }, [options]);

  // --- Image Handlers ---
  const handleAddImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newItems = files.map(file => ({
      url: URL.createObjectURL(file),
      file,
      type: 'upload' as const
    }));
    
    setGallery(prev => {
      const updated = [...prev, ...newItems];
      if (!formData.image_url && updated.length > 0) {
        setFormData(f => ({ ...f, image_url: updated[0].url }));
      }
      return updated;
    });
  };

  const removeImage = (index: number) => {
    setGallery(prev => {
      const removed = prev[index];
      const updated = prev.filter((_, i) => i !== index);
      if (formData.image_url === removed.url) {
        setFormData(f => ({ ...f, image_url: updated[0]?.url || '' }));
      }
      return updated;
    });
  };

  const setAsMainImage = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }));
  };

  // --- Option Handlers ---
  const addOption = () => {
    if (!newOptionName.trim()) return;
    setOptions([...options, { name: newOptionName.trim(), values: [] }]);
    setNewOptionName('');
  };

  const addValueToOption = (optionIndex: number) => {
    if (!newOptionValue.trim()) return;
    const updated = [...options];
    if (!updated[optionIndex].values.includes(newOptionValue.trim())) {
      updated[optionIndex].values.push(newOptionValue.trim());
    }
    setOptions(updated);
    setNewOptionValue('');
  };

  const removeValue = (optionIndex: number, valueIndex: number) => {
    const updated = [...options];
    updated[optionIndex].values = updated[optionIndex].values.filter((_, i) => i !== valueIndex);
    if (updated[optionIndex].values.length === 0) {
      setOptions(updated.filter((_, i) => i !== optionIndex));
    } else {
      setOptions(updated);
    }
  };

  // --- URL Sanitizer for Supabase 400 Errors ---
  const sanitizeUrl = (url: string) => {
    if (!url) return url;
    if (url.includes('.supabase.co/storage/v1/object/') && !url.includes('/object/public/')) {
      return url.replace('/object/', '/object/public/');
    }
    return url;
  };

  // --- Submit Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || formData.price <= 0) {
      toast.error(t?.('fillRequired') || 'Please fill required fields');
      return;
    }

    startTransition(async () => {
      try {
        // 1. Upload all pending images
        const finalImages: string[] = [];
        let mainImageUrl = sanitizeUrl(formData.image_url);

        for (const item of gallery) {
          if (item.type === 'upload' && item.file) {
            const fileName = `${Date.now()}-${item.file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
            const { error } = await supabase.storage
              .from('products')
              .upload(fileName, item.file);

            if (error) throw new Error('Upload failed: ' + error.message);

            const { data: { publicUrl } } = supabase.storage
              .from('products')
              .getPublicUrl(fileName);

            const sanitized = sanitizeUrl(publicUrl);
            finalImages.push(sanitized);
            if (item.url === formData.image_url) mainImageUrl = sanitized;
          } else {
            finalImages.push(sanitizeUrl(item.url));
          }
        }

        // 2. Map final image URLs to variants
        const finalVariants = variants.map(v => ({
            ...v,
            image_url: sanitizeUrl(v.image_url || ''),
            price: Number(v.price),
            stock: Number(v.stock)
        }));

        const productData = {
          ...formData,
          image_url: mainImageUrl,
          images: finalImages,
          options,
          variants: finalVariants,
        };

        const result = product 
          ? await updateProduct({ id: product.id, ...productData } as any)
          : await createProduct(productData as any);

        if (result.success) {
          toast.success(product ? 'Product Synchronized' : 'Creation Executed');
          router.push('/admin/products');
        } else {
          toast.error(result.error);
        }
      } catch (err: any) {
        toast.error(err.message);
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 font-sans">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>
            {product ? 'Synchronize Unit' : 'Initialize Product'}
          </h1>
          <p className="text-[#00FF41] text-[10px] font-black uppercase tracking-[0.5em] mt-4">
            Security Clearance LVL 4 • Authorized Admin Only
          </p>
        </div>
        <button 
          onClick={() => router.push('/admin/products')}
          className="px-6 py-3 bg-white/5 border border-white/10 hover:border-[#d4af37] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
        >
          Abort
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12 pb-20">
        {/* Visual Matrix Section */}
        <section className="bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 p-10 shadow-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent pointer-events-none" />
          
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ImageIcon className="text-[#d4af37] w-5 h-5" />
                Visual Assets
              </h2>
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1">Deploy high-res imagery for maximum conversion</p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-[#d4af37] text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg"
            >
              Add Samples
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 relative z-10">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleAddImages}
            />
            {gallery.map((item, idx) => (
              <motion.div
                key={idx}
                layoutId={`img-${idx}`}
                className={`relative group aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                  item.url === formData.image_url ? 'border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'border-white/5'
                }`}
              >
                <img src={item.url} className="w-full h-full object-cover" alt="" />
                {item.url === formData.image_url && (
                    <div className="absolute top-2 left-2 bg-[#d4af37] text-black px-2 py-0.5 rounded text-[8px] font-black">COVER</div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image_url: item.url })}
                    className="p-2 bg-[#d4af37] text-black rounded-lg hover:scale-110 transition-transform"
                    title="Set primary"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setGallery(gallery.filter((_, i) => i !== idx))}
                    className="p-2 bg-red-500 text-white rounded-lg hover:scale-110 transition-transform"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Global Configuration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Attributes */}
          <div className="lg:col-span-2 bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 p-10 space-y-8 shadow-2xl relative">
            <div className="absolute top-0 right-10 -translate-y-1/2 bg-[#d4af37] text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">Core Metadata</div>
            
            <div className="space-y-8 mt-4">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.3em] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full" />
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-5 px-8 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all font-black uppercase tracking-tighter text-2xl placeholder-white/5 outline-none"
                  placeholder="NOM DU PRODUIT.EX"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.3em] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full" />
                  Narrative / Description
                </label>
                <textarea
                  required
                  rows={8}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-5 px-8 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all font-medium text-lg leading-relaxed placeholder-white/5 resize-none outline-none"
                  placeholder="Describe the luxury experience..."
                />
              </div>
            </div>
          </div>

          {/* Economic Hub */}
          <div className="space-y-12">
            <div className="bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 p-10 space-y-8 shadow-2xl relative">
              <div className="absolute top-0 right-10 -translate-y-1/2 bg-[#00FF41] text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">Financials</div>
              
              <div className="space-y-8 mt-4">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.3em]">Classification</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-5 px-8 focus:border-[#d4af37] transition-all font-black uppercase tracking-[0.2em] text-xs outline-none"
                  >
                    <option value="">Manual Selection</option>
                    {CATEGORIES.map(cat => <option key={cat} value={cat.toLowerCase()} className="bg-[#0a0a0a]">{cat}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#00FF41] uppercase tracking-[0.3em] block text-center">Price (TND)</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full bg-[#00FF41]/5 border border-[#00FF41]/20 text-[#00FF41] rounded-2xl py-6 px-4 text-center font-black text-3xl shadow-[inset_0_0_20px_rgba(0,255,65,0.05)] outline-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] block text-center">Legacy</label>
                    <input
                      type="number"
                      value={formData.compare_at_price}
                      onChange={(e) => setFormData({ ...formData, compare_at_price: Number(e.target.value) })}
                      className="w-full bg-red-500/5 border border-red-500/20 text-red-500 rounded-2xl py-6 px-4 text-center font-black text-3xl line-through decoration-white/20 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 p-10 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                  <LayoutGrid className="text-[#d4af37] w-6 h-6" />
                </div>
                <div>
                   <p className="text-white font-black uppercase text-[10px] tracking-widest">Inventory Status</p>
                   <p className="text-[#00FF41] text-[9px] font-black uppercase tracking-[0.3em] mt-1 italic">Active Node</p>
                </div>
              </div>
              <div className="h-6 w-[1px] bg-white/10" />
              <div className="text-right">
                <p className="text-white/20 text-[8px] font-black uppercase mb-1">Status</p>
                <p className="text-white font-black text-xl italic leading-none">∞ Sync</p>
              </div>
            </div>
          </div>
        </div>

        {/* Variant Matrix Section */}
        <section className="bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 p-10 shadow-2xl relative">
          <div className="absolute top-0 right-10 -translate-y-1/2 bg-white/20 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md">Branching Config</div>
          
          <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="text-[#d4af37] w-5 h-5" />
              Variant Architecture
            </h2>
            <div className="flex gap-4">
              <input 
                placeholder="Option Type (e.g. SIZE)" 
                value={newOptionName} 
                onChange={e => setNewOptionName(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-6 py-3 text-[10px] font-black uppercase tracking-widest text-[#d4af37] focus:border-[#d4af37] outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (newOptionName) {
                    setOptions([...options, { name: newOptionName.toUpperCase(), values: [] }]);
                    setNewOptionName('');
                  }
                }}
                className="bg-white text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#d4af37] transition-all"
              >
                Inject Option
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {options.map((opt, oIdx) => (
              <div key={oIdx} className="bg-white/[0.02] rounded-3xl p-8 border border-white/5 group relative overflow-hidden font-sans">
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <span className="text-[#d4af37] font-black uppercase italic tracking-[0.4em] text-xs">{opt.name}</span>
                  <button 
                    type="button"
                    onClick={() => setOptions(options.filter((_, i) => i !== oIdx))}
                    className="p-2 text-white/20 hover:text-red-500 hover:bg-white/5 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-3 relative z-10">
                  {opt.values.map((val, vIdx) => (
                    <motion.span 
                      key={vIdx} 
                      whileHover={{ y: -2 }}
                      className="bg-white/5 text-white/80 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest flex items-center gap-3 uppercase shadow-lg"
                    >
                      {val}
                      <X className="w-3 h-3 cursor-pointer hover:text-red-500 transition-colors" onClick={() => {
                        const newOpts = [...options];
                        newOpts[oIdx].values = newOpts[oIdx].values.filter((_, i) => i !== vIdx);
                        setOptions(newOpts);
                      }} />
                    </motion.span>
                  ))}
                  <div className="flex gap-2">
                    <input 
                      placeholder="+ Add Value" 
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black text-white hover:border-white/20 focus:border-[#d4af37] outline-none transition-all w-32 uppercase"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = (e.target as HTMLInputElement).value;
                          if (val) {
                            const newOpts = [...options];
                            newOpts[oIdx].values.push(val.toUpperCase());
                            setOptions(newOpts);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {variants.length > 0 && (
            <div className="mt-12 overflow-x-auto relative z-10">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[9px] font-black text-white/30 uppercase tracking-[0.5em] border-b border-white/5">
                    <th className="pb-6 px-4">Matrix Permutation</th>
                    <th className="pb-6 px-4">Allocated Stock</th>
                    <th className="pb-6 px-4 text-right">Unit Valuation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {variants.map((v, idx) => (
                    <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-6 px-4 font-black text-white text-[11px] uppercase tracking-tighter">
                        {Object.values(v.options).join(' • ')}
                      </td>
                      <td className="py-6 px-4">
                        <input 
                          type="number" 
                          value={v.stock}
                          onChange={e => {
                            const newV = [...variants];
                            newV[idx].stock = Number(e.target.value);
                            setVariants(newV);
                          }}
                          className="bg-transparent border-b border-white/10 w-24 text-sm font-bold text-[#00FF41] focus:border-[#00FF41] outline-none transition-all py-1"
                        />
                      </td>
                      <td className="py-6 px-4 text-right">
                        <input 
                          type="number" 
                          value={v.price}
                          onChange={e => {
                            const newV = [...variants];
                            newV[idx].price = Number(e.target.value);
                            setVariants(newV);
                          }}
                          className="bg-transparent border-b border-white/10 w-32 text-right text-sm font-black text-white focus:border-[#d4af37] outline-none transition-all py-1"
                        />
                        <span className="text-[9px] text-white/20 ml-2 font-black">TND</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Fixed Implementation Bar */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 lg:left-[calc(50%+128px)] z-50">
           <motion.button
             whileHover={{ scale: 1.05, y: -5 }}
             whileTap={{ scale: 0.95 }}
             type="submit"
             disabled={isPending}
             className="px-16 py-6 bg-[#d4af37] text-black font-black uppercase tracking-[0.4em] rounded-full shadow-[0_25px_60px_rgba(212,175,55,0.4)] transition-all flex items-center gap-4 group disabled:opacity-50"
           >
             {isPending ? (
               <>
                 <div className="w-5 h-5 border-4 border-black border-t-transparent rounded-full animate-spin" />
                 Processing...
               </>
             ) : (
               <>
                 <Database className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                 {product ? 'Synchronize Data Matrix' : 'Initialize Production'}
               </>
             )}
           </motion.button>
        </div>
      </form>
    </div>
  );
}
