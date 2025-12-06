"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number; // store in smallest currency unit if you prefer
  imageUrl?: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  totalQuantity: () => number;
  subtotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity = 1) => {
        // Check if user is logged in before adding
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("userToken");
          if (!token) {
            console.warn("Cannot add to cart: User not logged in");
            return;
          }
        }
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        });
      },
      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      clearCart: () => set({ items: [] }),
      increment: (id) => {
        // Check if user is logged in
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("userToken");
          if (!token) {
            console.warn("Cannot modify cart: User not logged in");
            return;
          }
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)),
        }));
      },
      decrement: (id) => {
        // Check if user is logged in
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("userToken");
          if (!token) {
            console.warn("Cannot modify cart: User not logged in");
            return;
          }
        }
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
            .filter((i) => i.quantity > 0),
        }));
      },
      setQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id ? { ...i, quantity } : i))
            .filter((i) => i.quantity > 0),
        })),
      totalQuantity: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.quantity * i.price, 0),
    }),
    {
      name: "crystel-cart",
      partialize: (state) => ({ items: state.items }),
      // Clear cart if user is not logged in when store initializes
      onRehydrateStorage: () => (state) => {
        if (typeof window !== "undefined" && state) {
          const token = localStorage.getItem("userToken");
          if (!token) {
            state.clearCart();
          }
        }
      },
    }
  )
);



