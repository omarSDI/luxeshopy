'use client';
import React, { useState, useMemo, useEffect } from 'react';
import StatsCard from '../components/StatsCard';
import SalesChart from '../components/SalesChart';
import RecentOrdersTable from '../components/RecentOrdersTable';
import TrafficStatsCard from '../components/TrafficStatsCard';
import { getTrafficStats } from '@/app/actions/analytics';
import {
    DollarSign,
    ShoppingBag,
    Package,
    Clock,
    TrendingUp,
    Calendar,
} from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';
import { Order, OrderStatus } from '@/lib/types';

interface DashboardClientProps {
    stats: {
        totalProducts: number;
        orders: Order[];
        totalSales: number;
        totalProfit: number;
        pendingOrders: number;
    };
    chartData: any[];
    recentOrders: Order[];
}

export default function DashboardClient({ stats: initialStats, chartData: initialChartData, recentOrders: initialRecentOrders }: DashboardClientProps) {
    const { t } = useLanguage();
    const [orders, setOrders] = useState<Order[]>(initialRecentOrders);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    
    
    // Analytics State
    const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('today');
    const [trafficStats, setTrafficStats] = useState<any>(null);
    const [loadingTraffic, setLoadingTraffic] = useState(false);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoadingTraffic(true);
            const data = await getTrafficStats(timeFilter);
            setTrafficStats(data);
            setLoadingTraffic(false);
        };
        fetchAnalytics();
    }, [timeFilter]);

    // Derived stats logic
    const derivedStats = useMemo(() => {
        const revenueSource = orders.filter((o: Order) =>
            o.payment_status?.toLowerCase() === 'paid' ||
            (o.status?.toLowerCase() !== 'cancelled' && o.status?.toLowerCase() !== 'pending')
        );

        const totalSales = revenueSource.reduce((sum: number, o: Order) => sum + Number(o.total_price || 0), 0);
        const pendingOrders = orders.filter((o: Order) => o.status?.toLowerCase() === 'pending').length;
        const totalProfit = totalSales * 0.3;

        return {
            totalSales,
            totalOrders: orders.length,
            pendingOrders,
            totalProducts: initialStats.totalProducts,
            totalProfit,
            orders: orders
        };
    }, [orders, initialStats.totalProducts]);

    const derivedChartData = useMemo(() => {
        const salesByDate: Record<string, number> = {};
        orders.forEach((order: Order) => {
            const status = order.status?.toLowerCase();
            const paymentStatus = order.payment_status?.toLowerCase();
            const isRevenue = paymentStatus === 'paid' || (status !== 'cancelled' && status !== 'pending');
            if (isRevenue) {
                const date = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                salesByDate[date] = (salesByDate[date] || 0) + Number(order.total_price || 0);
            }
        });
        const sortedEntries = Object.entries(salesByDate)
            .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
            .map(([date, sales]) => ({ date, sales: Number(sales.toFixed(2)) }))
            .slice(-7);
        return sortedEntries.length > 0 ? sortedEntries : initialChartData;
    }, [orders, initialChartData]);

    const handleStatusUpdate = (orderId: string, newStatus: string) => {
        setOrders((prev: Order[]) => prev.map((order: Order) => order.id === orderId ? { ...order, status: newStatus as OrderStatus } : order));
    };

    return (
        <div className="max-w-[1700px] mx-auto space-y-10 px-4 sm:px-6 lg:px-8 py-8 animate-fade-in bg-gray-50/50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-[#001f3f] tracking-tight uppercase" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {t('welcomeBack')}, <span className="text-[#c5a059]">Admin</span>
                    </h1>
                    <p className="text-gray-400 font-bold mt-1 uppercase tracking-widest text-[10px]">
                        OPERATIONAL COMMAND CENTER • {mounted ? new Date().toLocaleDateString() : '...'}
                    </p>
                </div>
                
                {/* Time Filter Toggle */}
                <div className="flex items-center bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
                    {(['today', 'week', 'month'] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeFilter(range)}
                            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                timeFilter === range 
                                ? 'bg-black text-white shadow-lg' 
                                : 'text-gray-400 hover:text-black hover:bg-gray-50'
                            }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Primary Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatsCard
                    title="REVENU TOTAL"
                    value={`${derivedStats.totalSales.toFixed(2)} TND`}
                    icon={<DollarSign className="w-8 h-8" />}
                    bgIcon={<DollarSign />}
                    trend="+12.5%"
                />
                <StatsCard
                    title="BÉNÉFICE TOTAL"
                    value={`${derivedStats.totalProfit.toFixed(2)} TND`}
                    icon={<TrendingUp className="w-8 h-8" />}
                    bgIcon={<TrendingUp />}
                    trend="+8.2%"
                    variant="success"
                />
                <StatsCard
                    title={t('orders')}
                    value={derivedStats.totalOrders.toString()}
                    icon={<ShoppingBag className="w-8 h-8" />}
                    bgIcon={<ShoppingBag />}
                />
                <StatsCard
                    title={t('pending')}
                    value={derivedStats.pendingOrders.toString()}
                    icon={<Clock className="w-8 h-8" />}
                    bgIcon={<Clock />}
                    variant="warning"
                />
            </div>

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Left: Sales Chart (7 columns) */}
                <div className="xl:col-span-8 space-y-10">
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-100 min-h-[500px] flex flex-col">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-2xl font-black text-[#001f3f] uppercase italic italic tracking-tighter" style={{ fontFamily: 'Playfair Display, serif' }}>
                                    Sales Performance Trends
                                </h2>
                                <p className="text-gray-400 font-bold mt-1 uppercase tracking-widest text-[10px]">Revenue Matrix over time</p>
                            </div>
                        </div>
                        <div className="flex-1">
                            <SalesChart data={derivedChartData} />
                        </div>
                    </div>

                    {/* All Orders Table underneath chart */}
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-[#001f3f] uppercase italic tracking-tighter" style={{ fontFamily: 'Playfair Display, serif' }}>
                                Recent Transactions
                            </h2>
                            <button className="text-[10px] font-black underline tracking-widest text-[#c5a059]">VIEW ARCHIVE</button>
                        </div>
                        <div className="overflow-x-auto">
                            <RecentOrdersTable orders={orders.slice(0, 10)} onStatusUpdate={handleStatusUpdate} />
                        </div>
                    </div>
                </div>

                {/* Right: Analytics & Tools (4 columns) */}
                <div className="xl:col-span-4 space-y-10">
                    {/* Traffic Source Analytics Card */}
                    <TrafficStatsCard stats={trafficStats} loading={loadingTraffic} />

                    {/* Inventory Brief */}
                    <div className="bg-[#001f3f] rounded-[2.5rem] p-8 shadow-2xl text-white relative overflow-hidden group">
                        <div className="relative z-10 flex justify-between items-start">
                             <div>
                                <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-1">Stock Portfolio</p>
                                <h3 className="text-4xl font-black italic">{derivedStats.totalProducts}</h3>
                                <p className="text-xs font-bold text-[#c5a059] mt-2">ACTIVE SKUS IN GALLERY</p>
                             </div>
                             <Package className="w-12 h-12 text-[#c5a059] opacity-20 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                    </div>

                    {/* Quick Tools or Promo (Optional) */}
                    <div className="bg-gradient-to-br from-[#c5a059] to-[#b8941e] rounded-[2.5rem] p-8 shadow-xl text-[#001f3f]">
                         <h4 className="text-lg font-black uppercase italic tracking-tighter mb-4">Pro Insights</h4>
                         <p className="text-sm font-bold opacity-80 leading-snug">
                             Your conversion rate is trending upwards. Consider launching a promo for "Direct" traffic to reward loyal customers.
                         </p>
                         <button className="mt-6 px-6 py-3 bg-[#001f3f] text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                             GENERATE REPORT
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
