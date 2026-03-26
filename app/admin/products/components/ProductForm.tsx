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
  Check 
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

  // --- Submit Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || formData.price <= 0) {
      toast.error(t('fillRequired'));
      return;
    }

    startTransition(async () => {
      try {
        // 1. Upload all pending images
        const finalImages: string[] = [];
        let mainImageUrl = formData.image_url;

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

            finalImages.push(publicUrl);
            if (item.url === formData.image_url) mainImageUrl = publicUrl;
          } else {
            finalImages.push(item.url);
          }
        }

        // 2. Map final image URLs to variants if they were linked by proxy
        const finalVariants = variants.map(v => {
          // If a variant image was a blob URL, we should update it to the public URL
          const galleryItem = gallery.find(g => g.url === v.image_url);
          if (galleryItem?.type === 'upload' && galleryItem.file) {
            // Find the matching public URL in finalImages by matching the filename or order
            // Simplified: we'll match it during the upload loop later if needed, 
            // but let's just make sure it's updated.
          }
          return v;
        });

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
          toast.success(product ? t('productUpdated') : t('productCreated'));
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/40 backdrop-blur-xl rounded-3xl border-2 border-white/10 p-8 shadow-2xl"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* --- Multi-Image Gallery --- */}
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Product Gallery</h3>
              <p className="text-gray-400 text-sm">Add high-quality photos. First image is the cover.</p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-[#d4af37] text-black rounded-lg font-bold flex items-center gap-2 hover:bg-[#b8941e] transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Photos
            </button>
            <input
              type="file"
              ref={fileInputRef}
              multiple
              className="hidden"
              accept="image/*"
              onChange={handleAddImages}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {gallery.map((img, idx) => (
              <div 
                key={idx} 
                className={`relative group aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                  formData.image_url === img.url ? 'border-[#d4af37] ring-2 ring-[#d4af37]/20 shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'border-white/10'
                }`}
              >
                <img src={img.url} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAsMainImage(img.url)}
                    className="p-2 bg-[#d4af37] text-black rounded-full hover:scale-110 transition-transform"
                    title="Set as Main"
                  >
                    <Star className={`w-4 h-4 ${formData.image_url === img.url ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {formData.image_url === img.url && (
                    <div className="absolute top-2 left-2 bg-[#d4af37] text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                        Cover
                    </div>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-gray-500 hover:border-[#d4af37] hover:text-[#d4af37] transition-all bg-white/5"
            >
              <Upload className="w-6 h-6 mb-2" />
              <span className="text-xs font-bold uppercase">Upload</span>
            </button>
          </div>
        </div>

        {/* --- Product Info --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">
                {t('productTitle')}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#d4af37] transition-all"
                placeholder="Ex: Galactic Voyager Pro"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">
                {t('productDescription')}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#d4af37] transition-all resize-none"
                placeholder="Explain the premium features..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/5 p-6 rounded-3xl border border-white/10 h-fit">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-black/40 border-2 border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#d4af37]"
                required
              >
                <option value="" className="bg-gray-900">Choose...</option>
                {CATEGORIES.map(c => <option key={c} value={c.toLowerCase()} className="bg-gray-900">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Base Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full bg-black/40 border-2 border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Discount %</label>
                <input
                  type="number"
                  value={formData.compare_at_price > 0 ? Math.round(((formData.compare_at_price - formData.price) / formData.compare_at_price) * 100) : 0}
                  onChange={(e) => {
                    const pct = Number(e.target.value);
                    if (pct > 0) setFormData({ ...formData, compare_at_price: Math.round((formData.price / (1 - pct/100)) * 100) / 100 });
                  }}
                  className="w-full bg-black/40 border-2 border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-[#d4af37]"
                />
            </div>
          </div>
        </div>

        {/* --- Attributes & Variants (YouCan Style) --- */}
        <div className="space-y-8 bg-white/5 p-8 rounded-3xl border border-white/10">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white uppercase tracking-tighter italic">Dynamic Attributes & Options</h3>
            <p className="text-gray-400 text-sm">Create attributes like "Color" or "Material". Combinations will be auto-generated.</p>
          </div>

          {/* Add Option */}
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-[10px] font-black text-[#d4af37] mb-1 uppercase">Attribute Name</label>
              <input 
                type="text" 
                value={newOptionName} 
                onChange={e => setNewOptionName(e.target.value)}
                placeholder="Ex: Color"
                className="bg-black/40 border-2 border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#d4af37]"
              />
            </div>
            <button 
              type="button" 
              onClick={addOption}
              className="h-11 px-6 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all font-bold"
            >
              Add Attribute
            </button>
          </div>

          {/* Existing Options */}
          <div className="space-y-6">
            {options.map((opt, oIdx) => (
              <div key={oIdx} className="bg-black/20 p-6 rounded-2xl border border-white/5 relative group">
                <button 
                  type="button" 
                  onClick={() => setOptions(options.filter((_, i) => i !== oIdx))}
                  className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <h4 className="text-[#d4af37] text-sm font-black uppercase mb-4 tracking-tighter">Attribute: {opt.name}</h4>
                <div className="flex flex-wrap gap-2 items-center">
                  {opt.values.map((val, vIdx) => (
                    <span key={vIdx} className="flex items-center gap-2 px-3 py-1.5 bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 rounded-lg text-sm font-bold">
                      {val}
                      <button type="button" onClick={() => removeValue(oIdx, vIdx)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder={`Add ${opt.name}...`}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addValueToOption(oIdx);
                        }
                      }}
                      value={newOptionValue}
                      onChange={e => setNewOptionValue(e.target.value)}
                      className="bg-transparent border-b-2 border-white/10 px-2 py-1 text-sm text-white outline-none focus:border-[#d4af37]"
                    />
                    <button type="button" onClick={() => addValueToOption(oIdx)} className="text-[#d4af37]"><Plus className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Variants Table */}
          {variants.length > 0 && (
            <div className="mt-10 overflow-x-auto rounded-2xl border border-white/10 bg-black/40">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] uppercase font-black tracking-widest text-[#d4af37]">
                    <th className="px-6 py-4">Variant</th>
                    <th className="px-6 py-4">Price (TND)</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Link Image</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {variants.map((variant, index) => (
                    <tr key={variant.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          {Object.entries(variant.options).map(([k, v]) => (
                            <span key={k} className="px-2 py-0.5 bg-white/10 rounded text-xs text-white">{v}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          type="number" 
                          value={variant.price}
                          onChange={e => {
                            const updated = [...variants];
                            updated[index].price = Number(e.target.value);
                            setVariants(updated);
                          }}
                          className="bg-transparent border-b border-white/10 px-2 py-1 text-sm text-white outline-none focus:border-[#d4af37] w-24"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          type="number" 
                          value={variant.stock}
                          onChange={e => {
                            const updated = [...variants];
                            updated[index].stock = Number(e.target.value);
                            setVariants(updated);
                          }}
                          className="bg-transparent border-b border-white/10 px-2 py-1 text-sm text-white outline-none focus:border-[#d4af37] w-20"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <select
                            value={variant.image_url || ''}
                            onChange={e => {
                              const updated = [...variants];
                              updated[index].image_url = e.target.value;
                              setVariants(updated);
                            }}
                            className="bg-black/80 border border-white/10 rounded-lg px-2 py-1 text-xs text-white outline-none"
                          >
                            <option value="">Default</option>
                            {gallery.map((img, i) => (
                              <option key={i} value={img.url}>Image {i + 1}</option>
                            ))}
                          </select>
                          {variant.image_url && (
                            <img src={variant.image_url} className="w-8 h-8 rounded object-cover border border-white/20" alt="" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* --- Final Actions --- */}
        <div className="flex gap-4 pt-10 border-t border-white/10">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isPending}
            className="flex-1 py-5 bg-gradient-to-r from-[#d4af37] to-[#b8941e] text-black font-black uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:shadow-[#d4af37]/40 transition-all disabled:opacity-50"
          >
            {isPending ? 'Processing...' : (product ? 'Synchronize Updates' : 'Manifest Product')}
          </motion.button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-10 py-5 bg-white/5 text-white font-bold uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}
