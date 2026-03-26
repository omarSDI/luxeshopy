"use client";

import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  variant?: 'default' | 'warning' | 'success';
  bgIcon?: React.ReactNode;
}

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  variant = 'default',
  bgIcon,
}: StatsCardProps) {
  const getGradient = () => {
    switch (variant) {
      case 'warning': return 'from-yellow-50/50 to-white';
      case 'success': return 'from-green-50/50 to-white';
      default: return 'from-white to-white';
    }
  };

  const getIconBg = () => {
    switch (variant) {
      case 'warning': return 'bg-yellow-100 text-yellow-600';
      case 'success': return 'bg-emerald-100 text-emerald-600';
      default: return 'bg-[#0a0a0a]/5 text-[#0a0a0a]';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
      className={`relative overflow-hidden bg-gradient-to-br ${getGradient()} rounded-[2rem] border border-gray-100 p-8 shadow-sm transition-all duration-300`}
    >
      {/* Background Large Icon */}
      {bgIcon && (
        <div className="absolute -right-4 -top-4 text-gray-100 opacity-40 scale-[2.5] pointer-events-none transform -rotate-12 transition-transform duration-500 group-hover:rotate-0">
          {bgIcon}
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className={`p-4 rounded-2xl ${getIconBg()}`}>
            {icon}
          </div>
          {trend && (
            <div className={`text-sm font-bold flex items-center gap-1 px-3 py-1 rounded-full ${trend.startsWith('+') ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
              {trend}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-bold text-gray-400 mb-1 uppercase tracking-[0.1em]">
            {title}
          </p>
          <div className="flex flex-col">
            <p
              className="text-4xl font-extrabold text-[#0a0a0a]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {value}
            </p>
            {/* Subtitle/Explanation */}
            {variant === 'success' && (
              <p className="text-[10px] text-gray-400 font-medium mt-1 italic">
                (Basé sur une marge de 30% estimée)
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
