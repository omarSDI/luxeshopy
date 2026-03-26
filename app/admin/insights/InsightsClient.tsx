'use client';

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
        <div className="max-w-[1600px] mx-auto space-y-10 px-4 sm:px-6 lg:px-8 py-8 animate-fade-in bg-gray-50/50 min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1
                        className="text-4xl font-extrabold text-[#001f3f] tracking-tight"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                        {t('insights')}
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Analyse approfondie de vos performances.</p>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatsCard
                    title={t('totalRevenue')}
                    value={`${derivedData.totalRevenue.toFixed(2)} TND`}
                    icon={<DollarSign className="w-8 h-8" />}
                    bgIcon={<DollarSign />}
                    trend="+15.2%"
                />
                <StatsCard
                    title={t('totalProfit')}
                    value={`${derivedData.estimatedProfit.toFixed(2)} TND`}
                    icon={<TrendingUp className="w-8 h-8" />}
                    bgIcon={<TrendingUp />}
                    variant="success"
                    trend="+12.8%"
                />
                <StatsCard
                    title={t('totalOrders')}
                    value={derivedData.totalOrdersCount.toString()}
                    icon={<ShoppingCart className="w-8 h-8" />}
                    bgIcon={<ShoppingCart />}
                />
                <StatsCard
                    title={t('profitMargin')}
                    value={`${derivedData.profitMargin}%`}
                    icon={<Percent className="w-8 h-8" />}
                    bgIcon={<Percent />}
                    variant="warning"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Revenue Chart */}
                <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col">
                    <h3
                        className="text-2xl font-bold text-[#001f3f] mb-8"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                        {t('salesTrend')}
                    </h3>
                    <div className="h-[350px] w-full" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%" minHeight={350}>
                            <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#001f3f" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#001f3f" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '20px',
                                        border: 'none',
                                        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
                                        backgroundColor: '#001f3f',
                                        color: '#fff',
                                        padding: '16px'
                                    }}
                                    itemStyle={{ color: '#d4af37', fontWeight: 'bold' }}
                                    labelStyle={{ color: '#94a3b8', fontWeight: 'bold', marginBottom: '4px' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#001f3f"
                                    fillOpacity={1}
                                    fill="url(#colorPv)"
                                    strokeWidth={4}
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Pie Chart */}
                <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col">
                    <h3
                        className="text-2xl font-bold text-[#001f3f] mb-8"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                        {t('allOrders')}
                    </h3>
                    <div className="h-[350px] w-full" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%" minHeight={350}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={8}
                                    dataKey="value"
                                    animationDuration={1500}
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    formatter={(value) => <span className="text-gray-600 font-bold px-2">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
