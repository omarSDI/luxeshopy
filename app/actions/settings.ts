'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getSettings() {
    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from('settings')
        .select('*');

    if (error) {
        console.error('Error fetching settings:', error);
        return [];
    }

    return data;
}

export async function getShippingFee() {
    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'shipping_fee')
        .single();

    if (error) {
        // Return default fallback
        return { amount: 7, free_threshold: 0 };
    }

    return data.value;
}

export async function updateShippingFee(amount: number, freeThreshold: number = 0) {
    const supabase = await createServerClient();
    const { error } = await supabase
        .from('settings')
        .upsert({ 
            key: 'shipping_fee', 
            value: { amount, free_threshold: freeThreshold } 
        });

    if (error) {
        console.error('Error updating shipping fee:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/settings');
    revalidatePath('/');
    return { success: true };
}
