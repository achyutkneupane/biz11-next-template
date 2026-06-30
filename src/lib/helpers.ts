export function formatPrice(price: string, currency: string): string {
  const amount = parseFloat(price);
  if (Number.isNaN(amount)) return `${currency} 0.00`;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "NPR",
    currencyDisplay: "narrowSymbol",
  }).format(amount);
}
