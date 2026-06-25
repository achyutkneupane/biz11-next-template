import type { BusinessState } from "./initialState";

export const selectBizId = (state: BusinessState) => state.nanoId;
export const selectCurrency = (state: BusinessState) => state.currency;
export const selectIsBizLoaded = (state: BusinessState) => state.isLoaded;
export const selectToken = (state: BusinessState) => state.token;
export const selectBusinessName = (state: BusinessState) => state.name;
export const selectVisitorId = (state: BusinessState) => state.visitorId;
export const selectVisitorSignature = (state: BusinessState) => state.visitorSignature;
