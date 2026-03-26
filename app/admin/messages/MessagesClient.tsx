'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, User, Calendar, Trash2, CheckCircle, Eye, X } from 'lucide-react';
import { updateMessageStatus, deleteMessage } from '@/app/actions/messages';

export default function MessagesClient({ initialMessages }: { initialMessages: any[] }) {
    const [messages, setMessages] = useState(initialMessages);
    const [selectedMessage, setSelectedMessage] = useState<any>(null);

    const handleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'read' ? 'unread' : 'read';
        setMessages(messages.map(m => m.id === id ? { ...m, status: newStatus } : m));
        await updateMessageStatus(id, newStatus);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;
        setMessages(messages.filter(m => m.id !== id));
        await deleteMessage(id);
    };

    return (
        <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-8 py-6 text-sm font-black text-[#001f3f] uppercase tracking-widest">Customer</th>
                                <th className="px-8 py-6 text-sm font-black text-[#001f3f] uppercase tracking-widest">Subject</th>
                                <th className="px-8 py-6 text-sm font-black text-[#001f3f] uppercase tracking-widest text-center">Date</th>
                                <th className="px-8 py-6 text-sm font-black text-[#001f3f] uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-6 text-sm font-black text-[#001f3f] uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {messages.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <Mail className="w-12 h-12 text-gray-200 mb-4" />
                                            <p className="text-gray-400 font-bold">No messages found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                messages.map((msg) => (
                                    <motion.tr 
                                        key={msg.id} 
                                        layout
                                        className={`hover:bg-gray-50/50 transition-colors ${msg.status === 'unread' ? 'bg-blue-50/20' : ''}`}
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                                                    <User className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#001f3f]">{msg.name}</p>
                                                    <p className="text-xs text-gray-400 font-medium">{msg.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-semibold text-[#001f3f]">{msg.subject || 'No Subject'}</span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="flex flex-col items-center">
                                                <Calendar className="w-4 h-4 text-gray-300 mb-1" />
                                                <span className="text-xs text-gray-500 font-bold">
                                                    {new Date(msg.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                msg.status === 'unread' 
                                                ? 'bg-blue-100 text-blue-600' 
                                                : 'bg-emerald-100 text-emerald-600'
                                            }`}>
                                                {msg.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => setSelectedMessage(msg)}
                                                    className="p-2.5 bg-gray-50 text-[#001f3f] hover:bg-[#001f3f] hover:text-white rounded-xl transition-all"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleStatus(msg.id, msg.status)}
                                                    className={`p-2.5 rounded-xl transition-all ${
                                                        msg.status === 'unread' 
                                                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white' 
                                                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(msg.id)}
                                                    className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Message Modal */}
            <AnimatePresence>
                {selectedMessage && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#001f3f]/40 backdrop-blur-md"
                            onClick={() => setSelectedMessage(null)}
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <div>
                                    <h3 className="text-2xl font-black text-[#001f3f]" style={{ fontFamily: 'Playfair Display, serif' }}>
                                        Message Details
                                    </h3>
                                    <p className="text-sm font-bold text-[#d4af37] uppercase tracking-widest mt-1">
                                        Received on {new Date(selectedMessage.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setSelectedMessage(null)}
                                    className="p-3 bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-2xl border border-gray-100 transition-all"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="p-10 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Sender</p>
                                        <p className="font-bold text-[#001f3f] text-lg">{selectedMessage.name}</p>
                                        <p className="text-sm text-gray-500 font-medium">{selectedMessage.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Subject</p>
                                        <p className="font-bold text-[#001f3f] text-lg">{selectedMessage.subject || 'No Subject'}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Message Content</p>
                                    <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                                        <p className="text-[#001f3f] leading-relaxed whitespace-pre-wrap font-medium">
                                            {selectedMessage.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 bg-gray-50 flex justify-end">
                                <button 
                                    onClick={() => setSelectedMessage(null)}
                                    className="px-8 py-3 bg-[#001f3f] text-white rounded-xl font-bold uppercase tracking-widest hover:bg-[#d4af37] transition-all"
                                >
                                    Done
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
