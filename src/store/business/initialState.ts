export type BusinessState = {
  nanoId: string | null;
  name: string | null;
  currency: string | null;
  isLoaded: boolean;
  stripePublishableKey: string;
};

export const initialBusinessState: BusinessState = {
  nanoId: null,
  name: null,
  currency: null,
  isLoaded: false,
  stripePublishableKey: "",
};
