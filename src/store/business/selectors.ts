import type { BusinessState } from "./initialState";

export const selectBizId = (state: BusinessState) => state.nanoId;

export const selectCurrency = (state: BusinessState) => state.currency;

export const selectIsBizLoaded = (state: BusinessState) => state.isLoaded;

export const selectBusinessName = (state: BusinessState) => state.name;

export const selectStripeKey = (state: BusinessState) => state.stripePublishableKey;
