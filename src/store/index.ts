import { create } from "zustand";
import type { CartState } from "./cart/initialState";
import { initialCartState } from "./cart/initialState";
import type { CartAction } from "./cart/action";
import { createCartSlice } from "./cart/action";
import type { BusinessState } from "./business/initialState";
import { initialBusinessState } from "./business/initialState";
import type { BusinessAction } from "./business/action";
import { createBusinessSlice } from "./business/action";

export type Store = CartState & CartAction & BusinessState & BusinessAction;

export const useStore = create<Store>()((...a) => ({
  ...initialCartState,
  ...createCartSlice(...a),
  ...initialBusinessState,
  ...createBusinessSlice(...a),
}));
