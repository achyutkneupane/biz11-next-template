import type { CartState } from "./initialState";

export const selectCartItems = (state: CartState) => state.items;

export const selectCartCount = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartSubtotal = (state: CartState) =>
  state.items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
