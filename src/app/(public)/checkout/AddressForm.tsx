"use client";

import { useState } from "react";
import { useCreateAddress } from "@biz11/Hooks/addresses/useCreateAddress";
import { Input } from "@biz11/components/ui/Input";
import { Button } from "@biz11/components/ui/Button";
import type { AddressResource } from "@biz11/Types/Api";
import { z } from "zod";

const addressSchema = z.object({
  name: z.string().min(1, "Recipient name is required"),
  phone: z.string().regex(/^[0-9+\-\s()]*$/, "Invalid phone number").optional().or(z.literal("")),
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  postalCode: z.string().optional(),
});

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
  const [errors, setErrors] = useState<Partial<Record<keyof z.infer<typeof addressSchema>, string>>>({});

  const handleSubmit = () => {
    setErrors({});
    const result = addressSchema.safeParse({ name, phone, line1, line2, city, state, postalCode });
    if (!result.success) {
      const formattedErrors = result.error.format();
      setErrors({
        name: formattedErrors.name?._errors[0],
        phone: formattedErrors.phone?._errors[0],
        line1: formattedErrors.line1?._errors[0],
        line2: formattedErrors.line2?._errors[0],
        city: formattedErrors.city?._errors[0],
        state: formattedErrors.state?._errors[0],
        postalCode: formattedErrors.postalCode?._errors[0],
      });
      return;
    }

    createAddress.mutate(
      { name, phone: phone || undefined, line1, line2: line2 || undefined, city, state: state || undefined, postalCode: postalCode || undefined },
      {
        onSuccess: (data) => {
          onSuccess(data.data);
        },
      },
    );
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Input label="Recipient name" required value={name} onChange={(e) => setName(e.target.value)} />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>
        <div className="space-y-1">
          <Input label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
        </div>
        <div className="space-y-1">
          <Input label="Address line 1" required value={line1} onChange={(e) => setLine1(e.target.value)} />
          {errors.line1 && <p className="text-xs text-red-500">{errors.line1}</p>}
        </div>
        <div className="space-y-1">
          <Input label="Address line 2" value={line2} onChange={(e) => setLine2(e.target.value)} />
          {errors.line2 && <p className="text-xs text-red-500">{errors.line2}</p>}
        </div>
        <div className="space-y-1">
          <Input label="City" required value={city} onChange={(e) => setCity(e.target.value)} />
          {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
        </div>
        <div className="space-y-1">
          <Input label="State" value={state} onChange={(e) => setState(e.target.value)} />
          {errors.state && <p className="text-xs text-red-500">{errors.state}</p>}
        </div>
        <div className="space-y-1">
          <Input label="Postal code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
          {errors.postalCode && <p className="text-xs text-red-500">{errors.postalCode}</p>}
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="button" onClick={handleSubmit} disabled={createAddress.isPending || !name || !line1 || !city}>
          {createAddress.isPending ? "Saving..." : "Save address"}
        </Button>
      </div>
    </div>
  );
}
