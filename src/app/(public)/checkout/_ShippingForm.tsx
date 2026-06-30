"use client";

import { HiOutlineTruck } from "react-icons/hi2";
import { Input } from "@biz11/components/ui/Input";

export type ShippingFormData = {
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
};

export function _ShippingForm({
  data,
  onChange,
}: {
  data: ShippingFormData;
  onChange: (data: ShippingFormData) => void;
}) {
  const set = (field: keyof ShippingFormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...data, [field]: e.target.value });

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
        <Input label="Full Name *" value={data.name} onChange={set("name")} placeholder="John Doe" required />
        <Input label="Phone Number" type="tel" value={data.phone} onChange={set("phone")} placeholder="+1 (555) 000-0000" />
        <Input label="Street Address *" value={data.line1} onChange={set("line1")} placeholder="123 Main Street" required />
        <Input label="Apt / Suite (optional)" value={data.line2} onChange={set("line2")} placeholder="Apt 4B" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input label="City *" value={data.city} onChange={set("city")} placeholder="New York" required />
          <Input label="State" value={data.state} onChange={set("state")} placeholder="NY" />
          <Input label="ZIP Code" value={data.postalCode} onChange={set("postalCode")} placeholder="10001" />
        </div>
      </div>
    </section>
  );
}
