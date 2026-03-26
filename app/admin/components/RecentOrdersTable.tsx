'use client';

import React from 'react';
import { Order, OrderStatus } from '@/lib/types';
import { toast } from 'sonner';
import { updateOrderStatus } from '@/app/actions/orders';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import DetailedOrderModal from './DetailedOrderModal';

interface RecentOrdersTableProps {
  orders: Order[];
  showAll?: boolean;
  onStatusUpdate?: (orderId: string, newStatus: string) => void;
}

export default function RecentOrdersTable({
  orders,
  showAll = false,
  onStatusUpdate,
}: RecentOrdersTableProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = React.useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const displayOrders = showAll ? orders : orders.slice(0, 5);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setIsUpdating(orderId);
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.success) {
        toast.success('Statut mis à jour');
        if (onStatusUpdate) {
          onStatusUpdate(orderId, newStatus);
        }
        router.refresh();
      } else {
        toast.error(res.error || 'Erreur lors de la mise à jour');
      }
    } finally {
      setIsUpdating(null);
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-[#d4af37]/10 shadow-xl">
        <div className="w-16 h-16 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">Aucune commande récente</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] border-b border-white/5">
                <th className="px-8 py-6">Timestamp</th>
                <th className="px-8 py-6">Customer Identity</th>
                <th className="px-8 py-6">Valuation</th>
                <th className="px-8 py-6">Node Status</th>
                <th className="px-8 py-6 text-center">Settlement</th>
                <th className="px-8 py-6 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {displayOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-white font-black text-[11px] uppercase tracking-tighter">
                        {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-[9px] text-white/20 font-bold uppercase mt-1">
                        {new Date(order.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-white font-black uppercase tracking-tighter text-sm group-hover:text-[#d4af37] transition-colors">
                        {order.customer_name}
                      </span>
                      <span className="text-[10px] text-[#00FF41] font-black uppercase tracking-widest mt-1 opacity-60">
                         {order.phone}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-white font-black text-lg italic tracking-tighter">
                      {Number(order.total_price).toFixed(0)}
                      <span className="text-[10px] text-white/20 ml-2 not-italic">TND</span>
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <select
                      disabled={isUpdating === order.id}
                      value={order.status.toLowerCase()}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-[9px] font-black uppercase rounded-xl px-4 py-2 border transition-all cursor-pointer outline-none tracking-widest
                        ${order.status === 'delivered' ? 'bg-[#00FF41]/10 text-[#00FF41] border-[#00FF41]/20' :
                          order.status === 'pending' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                          'bg-white/5 text-white/40 border-white/10'
                        }`}
                    >
                      <option value="pending" className="bg-[#0a0a0a]">Pending</option>
                      <option value="shipped" className="bg-[#0a0a0a]">Shipped</option>
                      <option value="delivered" className="bg-[#0a0a0a]">Delivered</option>
                      <option value="cancelled" className="bg-[#0a0a0a]">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`text-[9px] font-black uppercase rounded-lg px-3 py-1.5 border tracking-[0.2em]
                      ${order.payment_status === 'paid' ? 'bg-[#00FF41]/5 text-[#00FF41] border-[#00FF41]/20' : 'bg-red-500/5 text-red-500 border-red-500/20'}
                    `}>
                      {order.payment_status?.toUpperCase() || 'UNSETTLED'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-[#d4af37] hover:text-black transition-all border border-white/10"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DetailedOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />
    </>
  );
}
