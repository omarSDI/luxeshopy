'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, Tablet, ExternalLink, Globe, Hash } from 'lucide-react';

interface TrafficStatsCardProps {
  stats: {
    total: number;
    sources: Record<string, number>;
    devices: {
        desktop: number;
        mobile: number;
        tablet: number;
    };
  } | null;
  loading?: boolean;
}

export default function TrafficStatsCard({ stats, loading }: TrafficStatsCardProps) {
  if (loading || !stats) {
    return (
      <div className="bg-[#0a0a0a] rounded-[3rem] p-10 shadow-2xl border border-white/10 animate-pulse h-full">
        <div className="h-6 w-32 bg-white/5 rounded-full mb-8"></div>
        <div className="space-y-6">
          <div className="h-24 bg-white/5 rounded-[2rem]"></div>
          <div className="h-64 bg-white/5 rounded-[2rem]"></div>
        </div>
      </div>
    );
  }

  const sourcesEntries = Object.entries(stats.sources).sort((a, b) => b[1] - a[1]);
  const totalVisits = stats.total || 1;

  return (
    <div className="bg-[#0a0a0a] rounded-[3rem] p-10 shadow-2xl border border-white/10 flex flex-col h-full relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent pointer-events-none" />
      
      <div className="flex items-center justify-between mb-10 relative z-10">
        <h3 className="text-xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            <Globe className="w-5 h-5 text-[#d4af37]" />
            Satellite Insights
        </h3>
        <span className="text-[9px] font-black text-[#00FF41] bg-[#00FF41]/10 px-4 py-1.5 rounded-full tracking-[0.2em] border border-[#00FF41]/20">LIVE DATA</span>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-12 relative z-10">
        <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 group-hover:border-white/10 transition-all">
            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">Total Nodes</p>
            <p className="text-4xl font-black text-white italic tracking-tighter">{stats.total}</p>
        </div>
        <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 group-hover:border-white/10 transition-all">
            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">Engaged</p>
            <p className="text-4xl font-black text-white italic tracking-tighter">{stats.total}</p>
        </div>
      </div>

      <div className="flex-1 space-y-8 relative z-10">
        <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] mb-6">Traffic Origin Matrix</h4>
        <div className="space-y-8">
            {sourcesEntries.length > 0 ? (
                sourcesEntries.map(([source, count]) => {
                    const percentage = (count / totalVisits) * 100;
                    return (
                        <div key={source} className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-3">
                                    <Hash className="w-3 h-3 text-[#d4af37]" />
                                    {source}
                                </span>
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">{count} hits</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                                    className="h-full bg-gradient-to-r from-[#d4af37] to-[#8a6d1d] rounded-full shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                                />
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className="text-[10px] text-center text-white/20 font-black py-16 uppercase tracking-[0.3em]">No telemetry detected</p>
            )}
        </div>
      </div>

      <div className="mt-12 pt-10 border-t border-white/10 grid grid-cols-3 gap-6 relative z-10">
        <div className="text-center space-y-3 group/icon">
            <div className="w-12 h-12 bg-white/5 rounded-[1.2rem] flex items-center justify-center mx-auto border border-white/5 group-hover/icon:border-[#d4af37]/40 transition-all">
                <Monitor className={`w-5 h-5 ${stats.devices.desktop > 0 ? 'text-[#d4af37]' : 'text-white/20'}`} />
            </div>
            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Desktop</p>
            <p className="text-sm font-black text-white italic tracking-tighter">{stats.devices.desktop}</p>
        </div>
        <div className="text-center space-y-3 group/icon">
            <div className="w-12 h-12 bg-white/5 rounded-[1.2rem] flex items-center justify-center mx-auto border border-white/5 group-hover/icon:border-[#d4af37]/40 transition-all">
                <Smartphone className={`w-5 h-5 ${stats.devices.mobile > 0 ? 'text-[#d4af37]' : 'text-white/20'}`} />
            </div>
            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Mobile</p>
            <p className="text-sm font-black text-white italic tracking-tighter">{stats.devices.mobile}</p>
        </div>
        <div className="text-center space-y-3 group/icon">
            <div className="w-12 h-12 bg-white/5 rounded-[1.2rem] flex items-center justify-center mx-auto border border-white/5 group-hover/icon:border-[#d4af37]/40 transition-all">
                <Tablet className={`w-5 h-5 ${stats.devices.tablet > 0 ? 'text-[#d4af37]' : 'text-white/20'}`} />
            </div>
            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Tablet</p>
            <p className="text-sm font-black text-white italic tracking-tighter">{stats.devices.tablet}</p>
        </div>
      </div>
    </div>
  );
}
