'use client';

import { useState } from 'react';
import { Truck, DollarSign, Save, CheckCircle } from 'lucide-react';
import { updateShippingFee } from '@/app/actions/settings';
import { motion } from 'framer-motion';

export default function SettingsClient({ initialShippingFee }: { initialShippingFee: any }) {
    const [amount, setAmount] = useState(initialShippingFee?.amount || 0);
    const [freeThreshold, setFreeThreshold] = useState(initialShippingFee?.free_threshold || 0);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        const res = await updateShippingFee(Number(amount), Number(freeThreshold));
        if (res.success) {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }
        setLoading(false);
    };

    return (
        <div className="grid grid-cols-1 gap-10">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-14 h-14 bg-[#001f3f] rounded-2xl flex items-center justify-center shadow-lg shadow-[#001f3f]/20">
                        <Truck className="w-7 h-7 text-[#d4af37]" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-[#001f3f]" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Shipping Configuration
                        </h3>
                        <p className="text-sm font-bold text-[#d4af37] uppercase tracking-[0.2em] mt-1">
                            Set global delivery costs
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="block text-sm font-black text-[#001f3f] uppercase tracking-widest pl-2">
                                Shipping Fee (TND)
                            </label>
                            <div className="relative group">
                                <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#d4af37] transition-colors" />
                                <input 
                                    type="number" 
                                    step="0.1"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pl-14 pr-6 py-5 text-[#001f3f] text-lg font-bold focus:border-[#d4af37] focus:bg-white outline-none transition-all shadow-inner"
                                    placeholder="e.g. 7.00"
                                    required
                                />
                            </div>
                            <p className="text-[11px] text-gray-500 font-medium pl-2">
                                This amount will be added to every order unless it meets the free threshold.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-black text-[#001f3f] uppercase tracking-widest pl-2">
                                Free Shipping Threshold (TND)
                            </label>
                            <div className="relative group">
                                <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#d4af37] transition-colors" />
                                <input 
                                    type="number" 
                                    step="1"
                                    value={freeThreshold}
                                    onChange={(e) => setFreeThreshold(e.target.value)}
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pl-14 pr-6 py-5 text-[#001f3f] text-lg font-bold focus:border-[#d4af37] focus:bg-white outline-none transition-all shadow-inner"
                                    placeholder="e.g. 150"
                                />
                            </div>
                            <p className="text-[11px] text-gray-500 font-medium pl-2">
                                Orders above this amount will have free shipping. Set to 0 to disable free shipping.
                            </p>
                        </div>
                    </div>

                    <div className="pt-6 flex items-center gap-6">
                        <button 
                            type="submit"
                            disabled={loading}
                            className={`flex-1 py-5 rounded-2xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-500 shadow-xl ${
                                success 
                                ? 'bg-emerald-500 text-white shadow-emerald-200' 
                                : 'bg-[#001f3f] text-white shadow-[#001f3f]/20 hover:bg-[#d4af37] hover:scale-[1.02]'
                            }`}
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : success ? (
                                <>
                                    <span>Settings Saved</span>
                                    <CheckCircle className="w-6 h-6" />
                                </>
                            ) : (
                                <>
                                    <span>Update Settings</span>
                                    <Save className="w-6 h-6" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
            
            {/* Preview Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#001f3f] rounded-[2.5rem] p-10 text-white relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative z-10">
                    <h4 className="text-xl font-black mb-6 uppercase tracking-widest text-[#d4af37]">Live Storefront Preview</h4>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-white/10">
                            <span className="text-white/60 font-bold">Standard Delivery:</span>
                            <span className="text-2xl font-black">{amount} TND</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-white/60 font-bold">Free Delivery Over:</span>
                            <span className="text-2xl font-black">{freeThreshold > 0 ? `${freeThreshold} TND` : 'Disabled'}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
