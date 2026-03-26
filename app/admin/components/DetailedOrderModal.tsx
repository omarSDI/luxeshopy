'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, MapPin, Phone, Calendar, DollarSign, CheckCircle2, Truck, AlertCircle, ShoppingBag } from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';
import { updateOrderStatus, updatePaymentStatus } from '@/app/actions/orders';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface DetailedOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
}

export default function DetailedOrderModal({ isOpen, onClose, order }: DetailedOrderModalProps) {
    const router = useRouter();

    if (!order) return null;

    const handleStatusUpdate = async (newStatus: string) => {
        const res = await updateOrderStatus(order.id, newStatus);
        if (res.success) {
            toast.success(`Order marked as ${newStatus}`);
            router.refresh();
        } else {
            toast.error(res.error || 'Failed to update status');
        }
    };

    const handlePaymentUpdate = async (newStatus: string) => {
        const res = await updatePaymentStatus(order.id, newStatus);
        if (res.success) {
            toast.success(`Payment marked as ${newStatus.toUpperCase()}`);
            router.refresh();
        } else {
            toast.error(res.error || 'Failed to update payment');
        }
    };

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-700',
        shipped: 'bg-blue-100 text-blue-700',
        delivered: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#001f3f]/60 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#d4af37]/20 flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="bg-[#001f3f] p-6 text-white flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#d4af37] rounded-xl flex items-center justify-center text-[#001f3f] shadow-inner">
                                    <ShoppingBag className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Order Details</h2>
                                    <p className="text-[#d4af37] text-sm font-medium">#{order.id.slice(0, 8).toUpperCase()}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto overflow-x-hidden space-y-8">
                            {/* Grid Layout */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Column: Customer & Delivery */}
                                <div className="space-y-6">
                                    <section>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Customer Info</h3>
                                        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                                                    <Package className="w-4 h-4 text-[#001f3f]" />
                                                </div>
                                                <span className="font-bold text-[#001f3f]">{order.customer_name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                                                    <Phone className="w-4 h-4 text-[#001f3f]" />
                                                </div>
                                                <span className="text-gray-600 font-medium">{order.phone || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 mt-0.5">
                                                    <MapPin className="w-4 h-4 text-[#001f3f]" />
                                                </div>
                                                <span className="text-gray-600 text-sm leading-relaxed">{order.address || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Actions</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => handleStatusUpdate('delivered')}
                                                className="flex items-center justify-center gap-2 py-3 px-4 bg-green-50 text-green-700 rounded-xl font-bold text-sm hover:bg-green-100 transition-colors border border-green-200"
                                            >
                                                <CheckCircle2 className="w-4 h-4" /> Mark Delivered
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate('shipped')}
                                                className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-50 text-blue-700 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors border border-blue-200"
                                            >
                                                <Truck className="w-4 h-4" /> Mark Shipped
                                            </button>
                                            <button
                                                onClick={() => handlePaymentUpdate('paid')}
                                                className="flex items-center justify-center gap-2 py-3 px-4 bg-[#d4af37]/10 text-[#001f3f] rounded-xl font-bold text-sm hover:bg-[#d4af37]/20 transition-colors border border-[#d4af37]/30"
                                            >
                                                <DollarSign className="w-4 h-4" /> Mark Paid
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate('cancelled')}
                                                className="flex items-center justify-center gap-2 py-3 px-4 bg-red-50 text-red-700 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors border border-red-200"
                                            >
                                                <AlertCircle className="w-4 h-4" /> Cancel Order
                                            </button>
                                        </div>
                                    </section>
                                </div>

                                {/* Right Column: Order Items */}
                                <div className="space-y-6">
                                    <section>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Items Summary</h3>
                                        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4 max-h-[300px] overflow-y-auto">
                                            {order.items && order.items.length > 0 ? (
                                                order.items.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-[#001f3f] truncate">{item.name}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {item.options && Object.entries(item.options).length > 0 ? 
                                                                    Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(' | ') : ''}
                                                                {` | ×${item.quantity}`}
                                                            </p>
                                                        </div>
                                                        <p className="font-bold text-[#d4af37] whitespace-nowrap ml-4">
                                                            {(item.price * item.quantity).toFixed(2)} TND
                                                        </p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-8 text-gray-400 italic">
                                                    No item details available for this order.
                                                </div>
                                            )}
                                        </div>
                                    </section>

                                    <div className="bg-[#001f3f] rounded-2xl p-6 text-white shadow-lg space-y-2">
                                        <div className="flex justify-between items-center opacity-70 text-sm">
                                            <span>Subtotal</span>
                                            <span>{Number(order.total_price).toFixed(2)} TND</span>
                                        </div>
                                        <div className="flex justify-between items-center opacity-70 text-sm">
                                            <span>Shipping</span>
                                            <span>0.00 TND</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-white/20">
                                            <span className="font-bold text-lg text-[#d4af37]">Grand Total</span>
                                            <span className="font-black text-2xl text-[#d4af37]">{Number(order.total_price).toFixed(2)} TND</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="bg-gray-50 p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm shrink-0">
                            <div className="flex items-center gap-2 text-gray-500">
                                <Calendar className="w-4 h-4" />
                                <span>Placed on {new Date(order.created_at).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-4 py-1.5 rounded-full font-bold uppercase text-[10px] shadow-sm ${statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'}`}>
                                    {order.status}
                                </span>
                                <span className={`px-4 py-1.5 rounded-full font-bold uppercase text-[10px] shadow-sm ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {order.payment_status?.toUpperCase() || 'UNPAID'}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
