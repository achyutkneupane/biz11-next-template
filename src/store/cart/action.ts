import type { StateCreator } from "zustand";
import type { CartState, CartItem } from "./initialState";

export interface CartAction {
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  setCartItems: (items: CartItem[]) => void;
}

export const createCartSlice: StateCreator<
  CartState & CartAction,
  [],
  [],
  CartAction
> = (set) => ({
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.skuId === item.skuId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.skuId === item.skuId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          ),
        };
      }
      return { items: [...state.items, item] };
    }),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, quantity } : i,
      ),
    })),
  clearCart: () => set({ items: [] }),
  setCartItems: (items) => set({ items }),
});
