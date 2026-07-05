export function formatPrice(price: string, currency: string | null): string {
  if (!currency) return "---";

  const amount = parseFloat(price);
  if (Number.isNaN(amount)) return `${currency} 0.00`;

  return `${currency} ${amount.toFixed(2)}`;
}
