import Link from "next/link";
import { Button } from "@biz11/components/ui/Button";

type CartSummaryProps = {
  subtotal: string;
  itemCount: number;
  formatPrice: (p: string) => string;
  onClose: () => void;
};

export function CartSummary({ subtotal, itemCount, formatPrice, onClose }: CartSummaryProps) {
  return (
    <div className="border-t border-border px-6 py-5">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm text-muted">Subtotal</span>
        <span className="text-xl font-black text-primary">{formatPrice(subtotal)}</span>
      </div>
      <p className="mb-5 text-xs text-muted-light">Shipping and taxes calculated at checkout</p>

      {itemCount > 0 ? (
        <Link href="/checkout" onClick={onClose}>
          <Button variant="primary" size="lg" className="w-full">
            Checkout &mdash; {formatPrice(subtotal)}
          </Button>
        </Link>
      ) : (
        <Button variant="primary" size="lg" className="w-full" disabled>
          Checkout &mdash; {formatPrice(subtotal)}
        </Button>
      )}
    </div>
  );
}
