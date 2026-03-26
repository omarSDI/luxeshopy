export interface ProductOption {
    name: string;
    values: string[];
}

export interface ProductVariant {
    id: string;
    options: Record<string, string>;
    price: number;
    stock: number;
    image_url: string | null;
}

export interface Product {
    id: string;
    title: string;
    description: string | null;
    price: number; // Base price
    image_url: string | null; // Thumbnail/Cover image
    images: string[] | null; // Multi-image gallery
    options: ProductOption[] | null; // Dynamic attributes like Color, Size
    variants: ProductVariant[] | null; // Specific combinations
    category?: string | null;
    stock: number;
    cost_price?: number;
    compare_at_price?: number;
    image_type?: 'url' | 'upload';
    created_at?: string;
    updated_at?: string;
}


export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled' | 'paid';
export type PaymentStatus = 'paid' | 'unpaid';

export interface Order {
    id: string;
    customer_name: string;
    phone: string | null;
    address: string | null;
    total_price: number;
    status: OrderStatus;
    payment_status: PaymentStatus;
    created_at: string;
    items?: any[];
}

export interface Customer {
    name: string;
    phone: string;
    address?: string;
    totalOrders: number;
    totalSpent: number;
    lastOrder: string;
    isPaid: boolean;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface DashboardStats {
    totalSales: number;
    totalOrders: number;
    totalProducts: number;
    pendingOrders: number;
    orders: Order[];
    totalProfit: number;
}

export interface CreateProductInput {
    title: string;
    description: string;
    price: number;
    image_url: string;
    images: string[];
    options: ProductOption[];
    variants: ProductVariant[];
    category: string;
    cost_price?: number;
    compare_at_price?: number;
    image_type?: 'url' | 'upload';
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
    id: string;
}

export interface CreateOrderInput {
    customer_name: string;
    phone: string;
    address: string;
    total_price: number;
    items: any[];
}
