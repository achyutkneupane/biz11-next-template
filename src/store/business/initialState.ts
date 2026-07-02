export type BusinessState = {
  nanoId: string | null;
  name: string | null;
  currency: string | null;
  isLoaded: boolean;
  stripePublishableKey: string;
  visitorId: string | null;
  visitorSignature: string | null;
};

let savedVisitorId: string | null = null;
let savedVisitorSignature: string | null = null;

if (typeof window !== "undefined") {
  savedVisitorId = sessionStorage.getItem("visitorId");
  savedVisitorSignature = sessionStorage.getItem("visitorSignature");
}

export const initialBusinessState: BusinessState = {
  nanoId: null,
  name: null,
  currency: null,
  isLoaded: false,
  stripePublishableKey: "",
  visitorId: savedVisitorId,
  visitorSignature: savedVisitorSignature,
};

