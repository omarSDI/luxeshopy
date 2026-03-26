"use client";

import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  variant?: 'default' | 'warning' | 'success';
  description?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  variant = 'default',
  description,
}: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative overflow-hidden bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 p-10 shadow-2xl transition-all duration-300 group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
            variant === 'success' ? 'bg-[#00FF41]/10 border-[#00FF41]/20 text-[#00FF41]' :
            variant === 'warning' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
            'bg-white/5 border-white/10 text-[#d4af37]'
          }`}>
            {icon}
          </div>
          {trend && (
            <div className={`text-[10px] font-black flex items-center gap-1 px-4 py-1.5 rounded-full uppercase tracking-widest ${
              trend.startsWith('+') ? 'text-[#00FF41] bg-[#00FF41]/10' : 'text-red-500 bg-red-500/10'
            }`}>
              {trend}
            </div>
          )}
        </div>

        <div>
          <p className="text-[10px] font-black text-white/30 mb-2 uppercase tracking-[0.4em]">
            {title}
          </p>
          <div className="flex flex-col">
            <h3 className="text-4xl font-black text-white italic tracking-tighter" style={{ fontFamily: 'Playfair Display, serif' }}>
              {value}
            </h3>
            {description && (
              <p className="text-[9px] text-[#00FF41] font-black mt-3 uppercase tracking-widest opacity-60">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
