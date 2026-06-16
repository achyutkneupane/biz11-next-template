import type { BusinessResource } from "@biz11/Types/Api";

const business: BusinessResource = {
  nanoId: "biz_demo_01",
  name: "Biz11",
  currency: "NPR",
  timezone: "Asia/Kathmandu",
};

export function getBusiness(): BusinessResource {
  return business;
}

export const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "\u20AC",
  GBP: "\u00A3",
  NPR: "\u20A8",
  INR: "\u20B9",
  JPY: "\u00A5",
};

export function formatPrice(
  price: string,
  currency: string = "USD",
): string {
  const symbol = currencySymbols[currency] || "$";
  return `${symbol}${price}`;
}
