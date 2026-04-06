"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Variante } from "@/types";

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string, ml: number) => void;
  updateQuantity: (id: string, ml: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      addItem: (newItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.id === newItem.id &&
              item.variante.ml === newItem.variante.ml
          );

          if (existingIndex > -1) {
            const currentItem = state.items[existingIndex];
            
            // Check if we already reached available stock
            if (currentItem.quantity >= newItem.variante.stock) {
              return { items: state.items };
            }

            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + 1,
            };
            return { items: updated };
          }

          // Even for new items, check if stock is at least 1
          if (newItem.variante.stock <= 0) {
            return { items: state.items };
          }

          return { items: [...state.items, { ...newItem, quantity: 1 }] };
        });
      },

      removeItem: (id, ml) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.id === id && item.variante.ml === ml)
          ),
        }));
      },

      updateQuantity: (id, ml, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id, ml);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && item.variante.ml === ml
              ? { ...item, quantity: Math.min(quantity, item.variante.stock) }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.variante.precio * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "nadira-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
