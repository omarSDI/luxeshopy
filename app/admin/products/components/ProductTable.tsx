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
    <div className="bg-white rounded-2xl border-2 border-[#d4af37]/20 shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white sticky left-0">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#d4af37]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 transition-all font-medium text-[#001f3f]"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-medium">
            <span className="text-sm">Search filters</span>
            <span className="bg-[#001f3f] text-[#d4af37] text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center">0</span>
          </button>
        </div>
        <table className="min-w-full text-sm">
          <thead className="bg-[#f8f9fa] border-b border-gray-200">
            <tr>
              <th className="w-12 py-4 px-6">
                <input type="checkbox" className="rounded border-gray-300 text-[#001f3f] focus:ring-[#d4af37]" />
              </th>
              <th className="text-left py-4 px-6 font-medium text-gray-500 text-xs uppercase tracking-wider">
                Name
              </th>
              <th className="text-left py-4 px-6 font-medium text-gray-500 text-xs uppercase tracking-wider">
                Price
              </th>
              <th className="text-left py-4 px-6 font-medium text-gray-500 text-xs uppercase tracking-wider">
                Inventory
              </th>
              <th className="text-left py-4 px-6 font-medium text-gray-500 text-xs uppercase tracking-wider">
                Orders
              </th>
              <th className="text-left py-4 px-6 font-medium text-gray-500 text-xs uppercase tracking-wider">
                Visibility
              </th>
              <th className="text-left py-4 px-6 font-medium text-gray-500 text-xs uppercase tracking-wider">
                Creation date
              </th>
              <th className="text-left py-4 px-6 font-medium text-gray-500 text-xs uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product, index) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-[#d4af37]/5 transition-colors"
              >
                <td className="py-4 px-6">
                  <input type="checkbox" className="rounded border-gray-300 text-[#001f3f] focus:ring-[#d4af37]" />
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    {product.image_url ? (
                      <div className="w-12 h-12 relative rounded border border-gray-200 overflow-hidden">
                        <img
                          src={product.image_url}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                        <Crown className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-[#001f3f] hover:text-[#d4af37] cursor-pointer">{product.title}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-900 font-medium">
                  {product.price.toFixed(0)} TND
                </td>
                <td className="py-4 px-6 text-gray-500">
                  Untracked
                </td>
                <td className="py-4 px-6 text-gray-500">
                  0
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex rounded bg-green-100 text-green-700 px-3 py-1 text-xs font-semibold">
                    Visible
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-500 text-sm">
                  {new Date().toLocaleDateString()}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-[#001f3f] rounded-full hover:bg-gray-100 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="p-2 text-gray-400 hover:text-[#001f3f] rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id, product.title)}
                      disabled={deletingId === product.id || isPending}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-[#001f3f] rounded-full hover:bg-gray-100 transition-colors">
                      <Copy className="w-4 h-4" />
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
