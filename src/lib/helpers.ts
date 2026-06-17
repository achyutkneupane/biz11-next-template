export function formatPrice(price: string, currency: string): string {
  return `${currency || "NPR"} ${price}`;
}
