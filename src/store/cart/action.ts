import type { StateCreator } from "zustand";
import type { CartState, CartItem } from "./initialState";

export interface CartAction {
  addItem: (item: CartItem) => void;
  removeItem: (nanoId: string) => void;
  updateQuantity: (nanoId: string, quantity: number) => void;
  clearCart: () => void;
}

export const createCartSlice: StateCreator<CartState & CartAction, [], [], CartAction> = (
  set,
) => ({
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.nanoId === item.nanoId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.nanoId === item.nanoId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          ),
        };
      }
      return { items: [...state.items, item] };
    }),
  removeItem: (nanoId) =>
    set((state) => ({
      items: state.items.filter((i) => i.nanoId !== nanoId),
    })),
  updateQuantity: (nanoId, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.nanoId === nanoId ? { ...i, quantity } : i,
      ),
    })),
  clearCart: () => set({ items: [] }),
});
