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
        <div className="max-w-[1700px] mx-auto space-y-12 px-6 lg:px-12 py-10 animate-fade-in min-h-screen">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4">
                <div>
                    <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {t('welcomeBack')}, <span className="text-[#d4af37]">Director</span>
                    </h1>
                    <p className="text-[#00FF41] text-[10px] font-black uppercase tracking-[0.5em] mt-4">
                        Core Systems Online • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                
                {/* Time Filter Space Station Toggle */}
                <div className="flex items-center bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
                    {(['today', 'week', 'month'] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeFilter(range)}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                timeFilter === range 
                                ? 'bg-[#d4af37] text-black shadow-[0_0_20px_rgba(212,175,55,0.3)]' 
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Primary Stats Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatsCard
                    title="Gross Revenue"
                    value={`${derivedStats.totalSales.toFixed(0)} TND`}
                    icon={<DollarSign className="w-6 h-6" />}
                    trend="+12.5%"
                    description="Total filtered revenue"
                />
                <StatsCard
                    title="Net Profit"
                    value={`${derivedStats.totalProfit.toFixed(0)} TND`}
                    icon={<TrendingUp className="w-6 h-6" />}
                    trend="+8.2%"
                    variant="success"
                    description="Estimated 30% margin"
                />
                <StatsCard
                    title="Volume"
                    value={derivedStats.totalOrders.toString()}
                    icon={<ShoppingBag className="w-6 h-6" />}
                    description="Total transactions"
                />
                <StatsCard
                    title="Pending Nodes"
                    value={derivedStats.pendingOrders.toString()}
                    icon={<Clock className="w-6 h-6" />}
                    variant="warning"
                    description="Awaiting processing"
                />
            </div>

            {/* Content Architecture */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                {/* Performance Analytics */}
                <div className="xl:col-span-8 space-y-12">
                    <div className="bg-[#0a0a0a] rounded-[3rem] p-12 shadow-2xl border border-white/10 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent pointer-events-none" />
                        
                        <div className="flex items-center justify-between mb-12 relative z-10">
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter" style={{ fontFamily: 'Playfair Display, serif' }}>
                                    Revenue Trajectory
                                </h2>
                                <p className="text-[#00FF41] font-black mt-1 uppercase tracking-widest text-[9px] opacity-80">Visualizing financial synchronization</p>
                            </div>
                        </div>
                        <div className="h-[400px] relative z-10">
                            <SalesChart data={derivedChartData} />
                        </div>
                    </div>

                    {/* Operational Stream */}
                    <div className="bg-[#0a0a0a] rounded-[3rem] p-12 shadow-2xl border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-12 -translate-y-1/2 bg-[#d4af37] text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Live Feed</div>
                        
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter" style={{ fontFamily: 'Playfair Display, serif' }}>
                                Transaction Stream
                            </h2>
                            <button className="text-[10px] font-black tracking-widest text-[#d4af37] hover:underline transition-all">TERMINAL ACCESS</button>
                        </div>
                        <div className="overflow-x-auto">
                            <RecentOrdersTable orders={orders.slice(0, 8)} onStatusUpdate={handleStatusUpdate} />
                        </div>
                    </div>
                </div>

                {/* Satellite Intelligence */}
                <div className="xl:col-span-4 space-y-12">
                    <TrafficStatsCard stats={trafficStats} loading={loadingTraffic} />

                    {/* Global Inventory Hub */}
                    <div className="bg-[#0a0a0a] rounded-[3rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                        <div className="relative z-10 flex justify-between items-center">
                             <div>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-2">Inventory Matrix</p>
                                <h3 className="text-5xl font-black text-white italic tracking-tighter line-none">{derivedStats.totalProducts}</h3>
                                <div className="flex items-center gap-2 mt-4">
                                    <div className="w-2 h-2 bg-[#00FF41] rounded-full animate-pulse" />
                                    <p className="text-[9px] font-black text-[#00FF41] uppercase tracking-[0.2em]">Active SKUs Synchronized</p>
                                </div>
                             </div>
                             <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/5 group-hover:rotate-12 transition-transform">
                                <Package className="w-10 h-10 text-[#d4af37]" />
                             </div>
                        </div>
                    </div>

                    {/* Strategic Intelligence */}
                    <div className="bg-gradient-to-br from-[#d4af37] to-[#8a6d1d] rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                         <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none" />
                         <h4 className="text-xl font-black text-black uppercase italic tracking-tighter mb-6 relative z-10">AI Directive</h4>
                         <p className="text-sm font-black text-black/80 leading-relaxed relative z-10">
                             Optimization Protocol: Your mobile conversion rate ({trafficStats?.mobileConversion || '8.2'}%) outpaces desktop by 24%. Recommended: Deploy mobile-exclusive lightning deals for the next 48 hours to capitalize on movement.
                         </p>
                         <button className="mt-8 px-10 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all relative z-10 shadow-2xl">
                             ACTIVATE PROTOCOL
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
