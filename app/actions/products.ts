'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminSession } from '@/lib/admin/auth';
import { Product, CreateProductInput, UpdateProductInput, ApiResponse } from '@/lib/types';

export async function getProducts(category?: string): Promise<Product[]> {
  try {
    const supabase = createServerClient();
    const normalizedCategory =
      category?.toLowerCase().trim() === 'men'
        ? 'men'
        : category?.toLowerCase().trim() === 'women'
          ? 'women'
          : undefined;

    let query = supabase.from('products').select('*').order('created_at', { ascending: true });
    if (normalizedCategory) {
      query = query.eq('category', normalizedCategory);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    return (
      data?.map((row: any) => ({
        id: String(row.id),
        title: String(row.title ?? ''),
        description: row.description ?? null,
        price: Number(row.price),
        image_url: row.image_url ?? null,
        images: row.images ?? [],
        options: row.options ?? [],
        variants: row.variants ?? [],
        category: row.category ?? null,
        cost_price: row.cost_price ?? 0,
        compare_at_price: row.compare_at_price ?? 0,
        image_type: row.image_type ?? 'url',
        created_at: row.created_at ?? undefined,
        updated_at: row.updated_at ?? undefined,
      })) ?? []
    );
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    if (!data) return null;

    return {
      id: String((data as any).id),
      title: String((data as any).title ?? ''),
      description: (data as any).description ?? null,
      price: Number((data as any).price),
      image_url: (data as any).image_url ?? null,
      images: (data as any).images ?? [],
      options: (data as any).options ?? [],
      variants: (data as any).variants ?? [],
      category: (data as any).category ?? null,
      cost_price: (data as any).cost_price ?? 0,
      compare_at_price: (data as any).compare_at_price ?? 0,
      image_type: (data as any).image_type ?? 'url',
      created_at: (data as any).created_at ?? undefined,
      updated_at: (data as any).updated_at ?? undefined,
    };
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

export async function createProduct(input: CreateProductInput): Promise<ApiResponse<Product>> {
  try {
    const session = await verifyAdminSession();
    if (!session) return { success: false, error: 'Unauthorized: Admin session required' };

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('products')
      .insert({
        title: input.title,
        description: input.description,
        price: input.price,
        image_url: input.image_url,
        images: input.images || [],
        options: input.options || [],
        variants: input.variants || [],
        category: input.category.toLowerCase(),
        cost_price: input.cost_price || 0,
        compare_at_price: input.compare_at_price || 0,
        image_type: input.image_type || 'url',
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    revalidatePath('/admin/products');
    revalidatePath('/shop');
    revalidatePath('/');

    return { success: true, data: data as Product };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function updateProduct(input: UpdateProductInput): Promise<ApiResponse<Product>> {
  try {
    const session = await verifyAdminSession();
    if (!session) return { success: false, error: 'Unauthorized: Admin session required' };

    const supabase = createServerClient();
    const { id, ...updates } = input;

    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    
    if (updates.title) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.image_url !== undefined) updateData.image_url = updates.image_url;
    if (updates.images !== undefined) updateData.images = updates.images;
    if (updates.options !== undefined) updateData.options = updates.options;
    if (updates.variants !== undefined) updateData.variants = updates.variants;
    if (updates.category) updateData.category = updates.category.toLowerCase();
    if (updates.cost_price !== undefined) updateData.cost_price = updates.cost_price;
    if (updates.compare_at_price !== undefined) updateData.compare_at_price = updates.compare_at_price;
    if (updates.image_type !== undefined) updateData.image_type = updates.image_type;

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    revalidatePath('/admin/products');
    revalidatePath('/admin/products/' + id);
    revalidatePath('/products/' + id);
    revalidatePath('/shop');
    revalidatePath('/');

    return { success: true, data: data as Product };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function deleteProduct(id: string): Promise<ApiResponse> {
  try {
    const session = await verifyAdminSession();
    if (!session) return { success: false, error: 'Unauthorized: Admin session required' };

    const supabase = createServerClient();
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) return { success: false, error: error.message };

    revalidatePath('/admin/products');
    revalidatePath('/shop');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
