"use client";

import { useState } from "react";
import { useCreateAddress } from "@biz11/Hooks/addresses/useCreateAddress";
import { Input } from "@biz11/components/ui/Input";
import { Button } from "@biz11/components/ui/Button";
import type { AddressResource } from "@biz11/Types/Api";

type Props = {
  onCancel: () => void;
  onSuccess: (address: AddressResource) => void;
};

export function AddressForm({ onCancel, onSuccess }: Props) {
  const createAddress = useCreateAddress();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAddress.mutate(
      { name, phone, line1, line2: line2 || undefined, city, state: state || undefined, postalCode: postalCode || undefined },
      {
        onSuccess: (data) => {
          onSuccess(data.data);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-4 space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input label="Recipient name" required value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Input label="Address line 1" required value={line1} onChange={(e) => setLine1(e.target.value)} />
        <Input label="Address line 2" value={line2} onChange={(e) => setLine2(e.target.value)} />
        <Input label="City" required value={city} onChange={(e) => setCity(e.target.value)} />
        <Input label="State" value={state} onChange={(e) => setState(e.target.value)} />
        <Input label="Postal code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
      </div>
      <div className="flex gap-3 justify-end">
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={createAddress.isPending || !name || !line1 || !city}>
          {createAddress.isPending ? "Saving..." : "Save address"}
        </Button>
      </div>
    </form>
  );
}
