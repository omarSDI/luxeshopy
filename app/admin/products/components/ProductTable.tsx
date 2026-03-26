'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Edit, Trash2, Crown, Eye, Copy, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { deleteProduct } from '@/app/actions/products';
import { Product } from '@/lib/types';

interface ProductTableProps {
  products: Product[];
}

export default function ProductTable({ products }: ProductTableProps) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(product => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    return (
      product.title.toLowerCase().includes(query) ||
      (product.description || '').toLowerCase().includes(query) ||
      (product.category || '').toLowerCase().includes(query) ||
      product.id.toLowerCase().includes(query)
    );
  });

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteProduct(id);
      if (result.success) {
        toast.success('Product deleted successfully');
        window.location.reload();
      } else {
        toast.error(result.error || 'Failed to delete product');
        setDeletingId(null);
      }
    });
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-2 border-[#d4af37]/20 p-12 text-center shadow-xl">
        <Crown className="w-16 h-16 text-[#d4af37]/50 mx-auto mb-4" />
        <p className="text-gray-500 mb-4 text-lg">No products found</p>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#001f3f] to-[#001f3f] hover:from-[#d4af37] hover:to-[#b8941e] text-white hover:text-[#001f3f] rounded-lg font-semibold transition-all duration-300 shadow-lg"
        >
          Add your first product
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] rounded-[2rem] border border-white/10 shadow-3xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent pointer-events-none" />
      
      <div className="overflow-x-auto relative z-10">
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 bg-[#0a0a0a]/80 backdrop-blur-xl">
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              placeholder="Search product inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all font-bold uppercase tracking-widest text-[10px]"
            />
            <div className="absolute left-6 top-4 text-[#d4af37]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Filtered: {filteredProducts.length}</span>
            <div className="h-4 w-[1px] bg-white/10" />
            <Link 
              href="/admin/products/new"
              className="px-6 py-3 bg-[#00FF41] text-black text-[10px] font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(0,255,65,0.3)] hover:scale-105 transition-all"
            >
              Add Product
            </Link>
          </div>
        </div>

        <table className="min-w-full">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="w-12 py-6 px-8">
                <input type="checkbox" className="rounded bg-white/5 border-white/10 text-[#d4af37] focus:ring-[#d4af37]" />
              </th>
              <th className="text-left py-6 px-8 text-[10px] font-black text-[#d4af37] uppercase tracking-[0.4em]">
                Identity & Visual
              </th>
              <th className="text-left py-6 px-8 text-[10px] font-black text-[#d4af37] uppercase tracking-[0.4em]">
                Valuation
              </th>
              <th className="text-left py-6 px-8 text-[10px] font-black text-[#d4af37] uppercase tracking-[0.4em]">
                Status
              </th>
              <th className="text-left py-6 px-8 text-[10px] font-black text-[#d4af37] uppercase tracking-[0.4em]">
                Matrix ID
              </th>
              <th className="text-right py-6 px-8 text-[10px] font-black text-[#d4af37] uppercase tracking-[0.4em]">
                Management
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredProducts.map((product, index) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="group hover:bg-white/[0.03] transition-all duration-300"
              >
                <td className="py-6 px-8">
                  <input type="checkbox" className="rounded bg-white/5 border-white/10 text-[#d4af37] focus:ring-[#d4af37]" />
                </td>
                <td className="py-6 px-8">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 relative rounded-2xl border border-white/10 overflow-hidden bg-white/5 group-hover:border-[#d4af37]/30 transition-all">
                      <img
                        src={product.image_url || ''}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e: any) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1546868871-70c122467d9b?q=80&w=800';
                        }}
                      />
                    </div>
                    <div>
                      <div className="font-black text-white text-xs uppercase tracking-widest group-hover:text-[#d4af37] transition-colors">{product.title}</div>
                      <div className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-1">{product.category}</div>
                    </div>
                  </div>
                </td>
                <td className="py-6 px-8">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-[#00FF41]">{product.price.toFixed(0)} TND</span>
                    {product.compare_at_price && (
                      <span className="text-[10px] text-white/20 line-through italic font-bold">{product.compare_at_price} TND</span>
                    )}
                  </div>
                </td>
                <td className="py-6 px-8">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#00FF41]/10 text-[#00FF41] text-[9px] font-black uppercase tracking-widest rounded-full border border-[#00FF41]/20">
                    <div className="w-1 h-1 bg-[#00FF41] rounded-full animate-pulse" />
                    Operational
                  </span>
                </td>
                <td className="py-6 px-8">
                   <span className="text-[9px] font-mono text-white/20 uppercase tracking-tighter truncate max-w-[100px] block">
                     {product.id}
                   </span>
                </td>
                <td className="py-6 px-8 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/products/${product.id}`}
                      target="_blank"
                      className="p-2.5 text-white/20 hover:text-[#d4af37] hover:bg-white/5 rounded-xl transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="p-2.5 text-white/20 hover:text-[#00FF41] hover:bg-white/5 rounded-xl transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id, product.title)}
                      disabled={deletingId === product.id || isPending}
                      className="p-2.5 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center bg-gray-50/50">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
              <MoreHorizontal className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-[#001f3f] mb-1">No products match your search</h3>
            <p className="text-gray-500 text-sm mb-6">Try adjusting your keywords or filters.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#d4af37] font-extrabold hover:underline text-sm"
            >
              Clear search query
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
