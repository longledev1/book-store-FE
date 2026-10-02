import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string; 
  productId: string;
  name: string;
  slug: string;
  price: number; 
  finalPrice: number; 
  image: string;
  category: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];

  // Actions
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

  // Getters
  getTotalCount: () => number;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem, quantityToAdd = 1) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(
          (item) => item.id === newItem.id || item.productId === newItem.productId
        );

        if (existingIndex > -1) {
          // Sản phẩm đã tồn tại trong giỏ ➔ Cộng dồn số lượng
          const updated = [...currentItems];
          updated[existingIndex].quantity += quantityToAdd;
          set({ items: updated });
        } else {
          // Sản phẩm mới ➔ Thêm mới vào mảng
          set({
            items: [
              ...currentItems,
              {
                ...newItem,
                quantity: quantityToAdd,
              },
            ],
          });
        }
      },

      removeItem: (id) => {
        set({
          items: get().items.filter(
            (item) => item.id !== id && item.productId !== id
          ),
        });
      },

      updateQuantity: (id, newQuantity) => {
        if (newQuantity <= 0) {
          get().removeItem(id);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.id === id || item.productId === id
              ? { ...item, quantity: newQuantity }
              : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalAmount: () => {
        return get().items.reduce(
          (total, item) => total + (item.finalPrice || item.price) * item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
