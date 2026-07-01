import type { StateCreator } from "zustand";
import type { BusinessState } from "./initialState";
import type { BusinessResource } from "@biz11/Types/Api";

export interface BusinessAction {
  setBusiness: (data: BusinessResource) => void;
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
      stripePublishableKey: data.stripePublishableKey ?? "",
      isLoaded: true,
    }),
});
