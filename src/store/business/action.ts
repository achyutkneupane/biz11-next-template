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
  setBusiness: (data) => {
    if (typeof window !== "undefined") {
      // SECURITY WARNING: Storing visitor identity in sessionStorage makes it vulnerable
      // to Cross-Site Scripting (XSS) attacks. A strict Content Security Policy (CSP)
      // is required to mitigate this risk.
      if (data.visitorId) {
        sessionStorage.setItem("visitorId", data.visitorId);
      }
      if (data.visitorSignature) {
        sessionStorage.setItem("visitorSignature", data.visitorSignature);
      }
    }
    set({
      nanoId: data.nanoId,
      name: data.name,
      currency: data.currency,
      stripePublishableKey: data.stripePublishableKey ?? "",
      visitorId: data.visitorId ?? null,
      visitorSignature: data.visitorSignature ?? null,
      isLoaded: true,
    });
  },
});
