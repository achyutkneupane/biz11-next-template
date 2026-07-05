import { QuantityInput } from "@biz11/components/ui/QuantityInput";
import Image from "next/image";
import { HiOutlineTrash } from "react-icons/hi2";

type CartItemRowProps = {
  coverUrl: string | null;
  productName: string;
  skuCode: string;
  subtotal: string;
  originalPrice?: string;
  quantity: number;
  formatPrice: (p: string) => string;
  onUpdateQuantity: (qty: number) => void;
  onRemove: () => void;
};

export function CartItemRow({
  coverUrl, productName, skuCode, subtotal, originalPrice, quantity, formatPrice, onUpdateQuantity, onRemove,
}: CartItemRowProps) {
  return (
    <div className="flex items-center gap-4 border-b border-border-light py-5 last:border-none">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-border-light">
        {coverUrl && <Image src={coverUrl} alt={productName || ""} width={80} height={80} className="h-full w-full object-cover" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{productName}</p>
        <p className="mt-1.5 text-xs text-muted">{skuCode}</p>
        <div className="mt-2 flex items-center gap-3">
          <QuantityInput value={quantity} max={999} onChange={onUpdateQuantity} />
          <div className="flex flex-col items-start leading-tight">
            <p className="text-base font-bold text-accent">{formatPrice(subtotal)}</p>
            {originalPrice && (parseFloat(originalPrice) * quantity).toFixed(2) !== parseFloat(subtotal).toFixed(2) && (
              <p className="text-xs font-semibold text-muted line-through">
                {formatPrice((parseFloat(originalPrice) * quantity).toString())}
              </p>
            )}
          </div>
        </div>
      </div>
      <button onClick={onRemove}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-light transition-colors duration-200 hover:bg-border-light hover:text-danger cursor-pointer"
        aria-label={`Remove ${productName}`}
      >
        <HiOutlineTrash className="h-4 w-4" />
      </button>
    </div>
  );
}
