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
      <div className="bg-white rounded-3xl border border-[#d4af37]/10 shadow-2xl overflow-hidden animate-fade-in relative">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#0a0a0a]/5 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-5 font-bold text-[#0a0a0a] uppercase tracking-wider">Date</th>
                <th className="px-6 py-5 font-bold text-[#0a0a0a] uppercase tracking-wider">Client</th>
                <th className="px-6 py-5 font-bold text-[#0a0a0a] uppercase tracking-wider">Total</th>
                <th className="px-6 py-5 font-bold text-[#0a0a0a] uppercase tracking-wider">Adresse</th>
                <th className="px-6 py-5 font-bold text-[#0a0a0a] border-x border-gray-50 uppercase tracking-wider text-center">Actions</th>
                <th className="px-6 py-5 font-bold text-[#0a0a0a] uppercase tracking-wider text-center">Paiement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400 font-medium">
                    {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#0a0a0a]">
                    {order.customer_name}
                    <div className="text-[10px] text-gray-400 font-medium mt-1">{order.phone}</div>
                  </td>
                  <td className="px-6 py-4 font-extrabold text-[#0a0a0a]">
                    {Number(order.total_price).toFixed(2)} <span className="text-[10px] text-gray-400 ml-0.5">TND</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs font-medium max-w-[150px] truncate" title={order.address || ''}>
                    {order.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <select
                        disabled={isUpdating === order.id}
                        value={order.status.toLowerCase()}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-[10px] font-bold uppercase rounded-full px-3 py-1 border transition-all cursor-pointer focus:ring-2 focus:ring-[#d4af37]/20 outline-none
                          ${order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                            order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                              'bg-gray-50 text-gray-700 border-gray-200'
                          }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="p-1.5 bg-[#0a0a0a]/5 text-[#0a0a0a] rounded-lg hover:bg-[#d4af37]/20 hover:text-[#0a0a0a] transition-all border border-transparent hover:border-[#d4af37]/30"
                        title="Voir détails"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`text-[10px] font-bold uppercase rounded-md px-2 py-1 shadow-sm
                      ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                    `}>
                      {order.payment_status?.toUpperCase() || 'UNPAID'}
                    </span>
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
