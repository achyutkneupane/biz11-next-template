export type BusinessState = {
  nanoId: string | null;
  name: string;
  currency: string;
  timezone: string;
  isLoaded: boolean;
  token: string | null;
};

export const initialBusinessState: BusinessState = {
  nanoId: null,
  name: "Biz11",
  currency: "USD",
  timezone: "UTC",
  isLoaded: false,
  token: null,
};
