'use server';

import { supabase } from '@/lib/supabase/client';

export interface VisitData {
  session_id?: string;
  referrer?: string;
  source?: string;
  path?: string;
  device_type?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export async function logVisit(data: VisitData) {
  try {
    const { error } = await supabase.from('visits').insert([data]);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error logging visit:', error);
    return { success: false, error };
  }
}

export async function getTrafficStats(timeRange: 'today' | 'week' | 'month' = 'today') {
  try {
    let query = supabase.from('visits').select('*');

    const now = new Date();
    if (timeRange === 'today') {
        const startOfDay = new Date(now.setHours(0,0,0,0)).toISOString();
        query = query.gte('created_at', startOfDay);
    } else if (timeRange === 'week') {
        const startOfWeek = new Date(now.setDate(now.getDate() - 7)).toISOString();
        query = query.gte('created_at', startOfWeek);
    } else if (timeRange === 'month') {
        const startOfMonth = new Date(now.setMonth(now.getMonth() - 1)).toISOString();
        query = query.gte('created_at', startOfMonth);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Grouping logic (could be done in SQL, but for small sets, JS is fine)
    const stats = {
        total: data.length,
        sources: {} as Record<string, number>,
        devices: { desktop: 0, mobile: 0, tablet: 0 } as Record<string, number>
    };

    data.forEach(v => {
        stats.sources[v.source] = (stats.sources[v.source] || 0) + 1;
        const device = v.device_type?.toLowerCase() || 'desktop';
        if (stats.devices[device] !== undefined) {
            stats.devices[device]++;
        }
    });

    return stats;

  } catch (error) {
    console.error('Error fetching traffic stats:', error);
    return null;
  }
}
