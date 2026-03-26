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
      <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 animate-pulse h-full">
        <div className="h-6 w-32 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-4">
          <div className="h-12 bg-gray-100 rounded-2xl"></div>
          <div className="h-48 bg-gray-100 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const sourcesEntries = Object.entries(stats.sources).sort((a, b) => b[1] - a[1]);
  const totalVisits = stats.total || 1;

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 flex flex-col h-full hover:shadow-2xl transition-all duration-500 overflow-hidden group">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-[#001f3f] tracking-tight uppercase italic flex items-center gap-3">
            <Globe className="w-5 h-5 text-[#c5a059]" />
            TRAFFIC INSIGHTS
        </h3>
        <span className="text-[10px] font-black text-white bg-black px-3 py-1 rounded-full tracking-widest">REAL-TIME</span>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-10">
        <div className="bg-gray-50 rounded-3xl p-5 border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Visitors</p>
            <p className="text-3xl font-black text-[#001f3f]">{stats.total}</p>
        </div>
        <div className="bg-gray-50 rounded-3xl p-5 border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Page Views</p>
            <p className="text-3xl font-black text-[#001f3f]">{stats.total}</p>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Traffic Sources</h4>
        <div className="space-y-5">
            {sourcesEntries.length > 0 ? (
                sourcesEntries.map(([source, count]) => {
                    const percentage = (count / totalVisits) * 100;
                    return (
                        <div key={source} className="space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-xs font-black text-[#001f3f] uppercase tracking-wider flex items-center gap-2">
                                    <Hash className="w-3 h-3 text-[#c5a059]" />
                                    {source}
                                </span>
                                <span className="text-xs font-bold text-gray-500">{count} visits</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-black rounded-full"
                                />
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className="text-xs text-center text-gray-400 font-bold py-10 italic">No data collected yet.</p>
            )}
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-gray-100 grid grid-cols-3 gap-4">
        <div className="text-center space-y-2">
            <Monitor className={`w-5 h-5 mx-auto ${stats.devices.desktop > 0 ? 'text-[#c5a059]' : 'text-gray-300'}`} />
            <p className="text-[9px] font-black text-gray-400 uppercase">Desktop</p>
            <p className="text-sm font-black text-[#001f3f]">{stats.devices.desktop}</p>
        </div>
        <div className="text-center space-y-2">
            <Smartphone className={`w-5 h-5 mx-auto ${stats.devices.mobile > 0 ? 'text-[#c5a059]' : 'text-gray-300'}`} />
            <p className="text-[9px] font-black text-gray-400 uppercase">Mobile</p>
            <p className="text-sm font-black text-[#001f3f]">{stats.devices.mobile}</p>
        </div>
        <div className="text-center space-y-2">
            <Tablet className={`w-5 h-5 mx-auto ${stats.devices.tablet > 0 ? 'text-[#c5a059]' : 'text-gray-300'}`} />
            <p className="text-[9px] font-black text-gray-400 uppercase">Tablet</p>
            <p className="text-sm font-black text-[#001f3f]">{stats.devices.tablet}</p>
        </div>
      </div>
    </div>
  );
}
