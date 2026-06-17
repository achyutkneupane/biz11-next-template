import { HiOutlineTruck } from "react-icons/hi2";
import { Input } from "@biz11/components/ui/Input";

export function _ShippingForm() {
  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <HiOutlineTruck className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Shipping Information</h2>
          <p className="text-xs text-muted">Where should we send your order?</p>
        </div>
      </div>
      <div className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="First Name" placeholder="John" />
          <Input label="Last Name" placeholder="Doe" />
        </div>
        <Input label="Email Address" type="email" placeholder="john@example.com" />
        <Input label="Phone Number" type="tel" placeholder="+1 (555) 000-0000" />
        <Input label="Street Address" placeholder="123 Main Street" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input label="City" placeholder="New York" />
          <Input label="State" placeholder="NY" />
          <Input label="ZIP Code" placeholder="10001" />
        </div>
      </div>
    </section>
  );
}
