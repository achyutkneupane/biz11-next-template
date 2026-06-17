import { create } from "zustand";
import type { CartState } from "./cart/initialState";
import { initialCartState } from "./cart/initialState";
import type { CartAction } from "./cart/action";
import { createCartSlice } from "./cart/action";

export type Store = CartState & CartAction;

export const useStore = create<Store>()((...a) => ({
  ...initialCartState,
  ...createCartSlice(...a),
}));
