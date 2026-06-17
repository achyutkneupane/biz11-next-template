const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "\u20AC",
  GBP: "\u00A3",
  NPR: "\u20A8",
};

export function formatPrice(price: string, currency: string): string {
  return `${currencySymbols[currency] || "$"}${price}`;
}
