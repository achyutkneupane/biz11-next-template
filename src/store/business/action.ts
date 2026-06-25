import type { StateCreator } from "zustand";
import type { BusinessState } from "./initialState";
import type { BusinessResource } from "@biz11/Types/Api";

export interface BusinessAction {
  setBusiness: (data: BusinessResource) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
}

export const createBusinessSlice: StateCreator<
  BusinessState & BusinessAction,
  [],
  [],
  BusinessAction
> = (set) => ({
  setBusiness: (data) =>
    set({
      nanoId: data.nanoId,
      name: data.name,
      currency: data.currency,
      timezone: data.timezone,
      visitorId: data.visitorId,
      visitorSignature: data.visitorSignature,
      isLoaded: true,
    }),
  setToken: (token) => set({ token }),
  clearAuth: () => set({ token: null }),
});
