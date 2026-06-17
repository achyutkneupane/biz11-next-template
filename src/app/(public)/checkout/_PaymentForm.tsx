import { HiOutlineCreditCard } from "react-icons/hi2";
import { Input } from "@biz11/components/ui/Input";

export function _PaymentForm() {
  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <HiOutlineCreditCard className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Payment Information</h2>
          <p className="text-xs text-muted">We accept all major credit cards</p>
        </div>
      </div>
      <div className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <Input label="Card Number" placeholder="4242 4242 4242 4242" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Expiry Date" placeholder="MM/YY" />
          <Input label="CVC" placeholder="123" />
        </div>
      </div>
    </section>
  );
}
