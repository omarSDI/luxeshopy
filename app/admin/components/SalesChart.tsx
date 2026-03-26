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
      <div className="flex items-center justify-center h-full text-gray-400 min-h-[350px] bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
        <div className="text-center">
          <p className="font-bold text-lg">Aucune donnée de vente</p>
          <p className="text-sm">Les statistiques apparaîtront ici.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#001f3f" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#001f3f" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="8 8"
            vertical={false}
            stroke="#f1f5f9"
          />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            fontSize={12}
            fontWeight={700}
            tickLine={false}
            axisLine={false}
            tick={{ dy: 15 }}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            fontWeight={700}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#001f3f',
              border: 'none',
              borderRadius: '20px',
              color: '#fff',
              boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
              padding: '16px 20px'
            }}
            itemStyle={{ color: '#d4af37', fontWeight: 'bold', fontSize: '14px' }}
            labelStyle={{ color: '#94a3b8', marginBottom: '8px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}
            formatter={(value: number | undefined) => [
              value !== undefined ? `${value.toFixed(2)} TND` : '0 TND',
              'VENTES',
            ]}
            cursor={{ stroke: '#001f3f', strokeWidth: 2, strokeDasharray: '5 5' }}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#001f3f"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorSales)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
