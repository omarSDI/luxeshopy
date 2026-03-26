'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface SalesChartProps {
  data: Array<{ date: string; sales: number }>;
}

export default function SalesChart({ data }: SalesChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-white/20 min-h-[350px] bg-white/5 rounded-[2rem] border-2 border-dashed border-white/10">
        <div className="text-center">
          <p className="font-black text-xs uppercase tracking-widest italic">No Telemetry</p>
          <p className="text-[9px] uppercase tracking-[0.3em] mt-2">Awaiting Sales Synchronization</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full min-h-[350px]">
      <ResponsiveContainer width="100%" height="100%" minHeight={350}>
        <AreaChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d4af37" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="10 10"
            vertical={false}
            stroke="rgba(255,255,255,0.05)"
          />
          <XAxis
            dataKey="date"
            stroke="rgba(255,255,255,0.2)"
            fontSize={9}
            fontWeight={900}
            tickLine={false}
            axisLine={false}
            tick={{ dy: 15 }}
          />
          <YAxis
            stroke="rgba(255,255,255,0.2)"
            fontSize={9}
            fontWeight={900}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '1.5rem',
              color: '#fff',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
              padding: '20px',
              fontFamily: 'Inter, sans-serif'
            }}
            itemStyle={{ color: '#00FF41', fontWeight: '900', fontSize: '14px' }}
            labelStyle={{ color: '#d4af37', marginBottom: '8px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}
            formatter={(value: any) => [
              `${Number(value || 0).toFixed(0)} TND`,
              'REVENUE SIGNAL',
            ]}
            cursor={{ stroke: '#d4af37', strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#d4af37"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorSales)"
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
