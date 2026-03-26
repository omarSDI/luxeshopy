'use client';

// Deployment Trigger: 2026-03-26 - Matrix UI Overhaul Fix

import React, { useMemo } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { DollarSign, TrendingUp, ShoppingCart, Percent } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { Order } from '@/lib/types';

interface InsightsClientProps {
    orders: Order[];
}

export default function InsightsClient({ orders }: InsightsClientProps) {
    const { t, isRTL } = useLanguage();

    // 1. Calculate KPIs with Synchronized Logic
    const derivedData = useMemo(() => {
        // Shared revenue logic: Paid or non-cancelled
        const revenueSource = orders.filter(o =>
            o.payment_status?.toLowerCase() === 'paid' ||
            (o.status?.toLowerCase() !== 'cancelled' && o.status?.toLowerCase() !== 'pending')
        );

        const totalRevenue = revenueSource.reduce((sum, order) => sum + Number(order.total_price || 0), 0);
        const totalOrdersCount = orders.filter(o => o.status !== 'cancelled').length;
        const estimatedProfit = totalRevenue * 0.3; // 30% Margin
        const profitMargin = totalRevenue > 0 ? 30 : 0;

        return {
            totalRevenue,
            totalOrdersCount,
            estimatedProfit,
            profitMargin,
            revenueSource
        };
    }, [orders]);

    // 2. Prepare Chart Data (Revenue over time)
    const salesData = useMemo(() => {
        const last7DaysMap = new Map();

        // Initialize last 7 days with zero
        [...Array(7)].forEach((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            last7DaysMap.set(dateStr, 0);
        });

        // Fill with actual data
        derivedData.revenueSource.forEach(order => {
            const dateStr = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (last7DaysMap.has(dateStr)) {
                last7DaysMap.set(dateStr, last7DaysMap.get(dateStr) + Number(order.total_price || 0));
            }
        });

        return Array.from(last7DaysMap.entries())
            .map(([name, revenue]) => ({ name, revenue: Number(revenue.toFixed(2)) }))
            .reverse();
    }, [derivedData.revenueSource]);

    const statusData = [
        { name: t('pending'), value: orders.filter(o => o.status === 'pending').length, color: '#f59e0b' },
        { name: t('shipped'), value: orders.filter(o => o.status === 'shipped').length, color: '#3b82f6' },
        { name: t('delivered'), value: orders.filter(o => o.status === 'delivered').length, color: '#10b981' },
        { name: t('cancelled'), value: orders.filter(o => o.status === 'cancelled').length, color: '#ef4444' },
    ];

    return (
        <div className="max-w-[1700px] mx-auto space-y-12 px-6 lg:px-12 py-10 animate-fade-in min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4">
                <div>
                     <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {t('insights')} <span className="text-[#d4af37]">Lab</span>
                    </h1>
                    <p className="text-[#00FF41] text-[10px] font-black uppercase tracking-[0.5em] mt-4">
                        Advanced Telemetry Analysis • Protocol Activated
                    </p>
                </div>
            </div>

            {/* Matrix Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatsCard
                    title={t('totalRevenue')}
                    value={`${derivedData.totalRevenue.toFixed(0)} TND`}
                    icon={<DollarSign className="w-6 h-6" />}
                    trend="+15.2%"
                    description="Gross valuation stream"
                />
                <StatsCard
                    title={t('totalProfit')}
                    value={`${derivedData.estimatedProfit.toFixed(0)} TND`}
                    icon={<TrendingUp className="w-6 h-6" />}
                    variant="success"
                    trend="+12.8%"
                    description="Estimated performance"
                />
                <StatsCard
                    title={t('totalOrders')}
                    value={derivedData.totalOrdersCount.toString()}
                    icon={<ShoppingCart className="w-6 h-6" />}
                    description="Active transactions"
                />
                <StatsCard
                    title={t('profitMargin')}
                    value={`${derivedData.profitMargin}%`}
                    icon={<Percent className="w-6 h-6" />}
                    variant="warning"
                    description="Yield efficiency"
                />
            </div>

            {/* Visual Intelligence Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Revenue Trajectory */}
                <div className="bg-[#0a0a0a] rounded-[3rem] p-12 shadow-2xl border border-white/10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent pointer-events-none" />
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-10 relative z-10" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Macro {t('salesTrend')}
                    </h3>
                    <div className="h-[400px] w-full relative z-10" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#d4af37" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 900 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 900 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '1.5rem',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
                                        backgroundColor: '#0a0a0a',
                                        color: '#fff',
                                        padding: '20px'
                                    }}
                                    itemStyle={{ color: '#00FF41', fontWeight: '900', fontSize: '14px' }}
                                    labelStyle={{ color: '#d4af37', fontWeight: '900', fontSize: '10px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.2em' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#d4af37"
                                    fillOpacity={1}
                                    fill="url(#colorPv)"
                                    strokeWidth={3}
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Segment Matrix */}
                <div className="bg-[#0a0a0a] rounded-[3rem] p-12 shadow-2xl border border-white/10 relative overflow-hidden flex flex-col">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-10 relative z-10" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Operational {t('allOrders')}
                    </h3>
                    <div className="flex-1 w-full relative z-10 min-h-[400px]" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%" minHeight={400}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={80}
                                    outerRadius={130}
                                    paddingAngle={10}
                                    dataKey="value"
                                    animationDuration={2000}
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ 
                                        borderRadius: '1.5rem', 
                                        border: '1px solid rgba(255,255,255,0.1)', 
                                        backgroundColor: '#0a0a0a', 
                                        color: '#fff',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                                        padding: '15px'
                                    }}
                                    itemStyle={{ color: '#fff', fontWeight: '900', fontSize: '12px' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    formatter={(value) => <span className="text-white/40 font-black text-[10px] px-3 uppercase tracking-widest">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
