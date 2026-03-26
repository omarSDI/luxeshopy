import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
}

export interface CartItem extends Product {
  lineId: string;
  quantity: number;
  variantId?: string;
  options?: Record<string, string>;
  // Legacy fields for backward compatibility if needed, but we'll focus on variants
  size?: number;
  color?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (
    product: Product, 
    opts?: { 
      variantId?: string; 
      options?: Record<string, string>;
      size?: number;
      color?: string;
    }
  ) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

function makeLineId(productId: string, variantId?: string, size?: number, color?: string) {
  if (variantId) return `${productId}::variant::${variantId}`;
  return `${productId}::${size ?? ''}::${color ?? ''}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, opts) => {
        const variantId = opts?.variantId;
        const options = opts?.options;
        const size = opts?.size;
        const color = opts?.color;
        
        const lineId = makeLineId(product.id, variantId, size, color);

        const items = get().items;
        const existingItem = items.find((item) => item.lineId === lineId);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.lineId === lineId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
          return;
        }

        set({
          items: [
            ...items,
            { ...product, lineId, quantity: 1, variantId, options, size, color } as CartItem,
          ],
        });
      },

      removeItem: (lineId: string) => {
        set({
          items: get().items.filter((item) => item.lineId !== lineId),
        });
      },

      updateQuantity: (lineId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(lineId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.lineId === lineId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'luxeshopy-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
