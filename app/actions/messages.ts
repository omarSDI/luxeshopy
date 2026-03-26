'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createMessage(formData: { name: string; email: string; subject?: string; message: string }) {
    const supabase = await createServerClient();
    const { error } = await supabase
        .from('messages')
        .insert([formData]);

    if (error) {
        console.error('Error creating message:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/messages');
    return { success: true };
}

export async function getMessages() {
    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching messages:', error);
        return [];
    }

    return data;
}

export async function updateMessageStatus(id: string, status: string) {
    const supabase = await createServerClient();
    const { error } = await supabase
        .from('messages')
        .update({ status })
        .eq('id', id);

    if (error) {
        console.error('Error updating message status:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/messages');
    return { success: true };
}

export async function deleteMessage(id: string) {
    const supabase = await createServerClient();
    const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting message:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/messages');
    return { success: true };
}
