"use client";

import { useState } from "react";
import { useAddresses } from "@biz11/Hooks/addresses/useAddresses";
import { AddressForm } from "./AddressForm";
import type { AddressResource } from "@biz11/Types/Api";

type Props = {
  title: string;
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export function AddressSelection({ title, selectedId, onSelect }: Props) {
  const { data: addresses, isLoading } = useAddresses();
  const [showForm, setShowForm] = useState(false);

  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-foreground">{title}</h2>

      {isLoading && (
        <p className="text-sm text-muted">Loading addresses...</p>
      )}

      {!isLoading && addresses && addresses.length > 0 && (
        <div className="space-y-2 mb-3">
          {addresses.map((addr) => (
            <label
              key={addr.id}
              className={`flex items-start gap-3 rounded-xl border-2 p-4 cursor-pointer transition-colors ${
                selectedId === addr.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary-light"
              }`}
            >
              <input
                type="radio"
                name={title}
                checked={selectedId === addr.id}
                onChange={() => onSelect(addr.id)}
                className="mt-0.5 h-4 w-4 accent-primary"
              />
              <div className="text-sm">
                <p className="font-semibold text-foreground">{addr.name}</p>
                {addr.phone && <p className="text-muted">{addr.phone}</p>}
                <p className="text-muted">
                  {addr.line1}
                  {addr.line2 && `, ${addr.line2}`}
                </p>
                <p className="text-muted">
                  {addr.city}{addr.state && `, ${addr.state}`} {addr.postalCode}
                </p>
                <p className="text-xs text-muted-light uppercase">{addr.country}</p>
              </div>
            </label>
          ))}
        </div>
      )}

      {!isLoading && (!addresses || addresses.length === 0) && !showForm && (
        <p className="text-sm text-muted mb-3">No saved addresses yet.</p>
      )}

      {showForm ? (
        <AddressForm
          onCancel={() => setShowForm(false)}
          onSuccess={(address: AddressResource) => {
            setShowForm(false);
            onSelect(address.id);
          }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="text-sm font-semibold text-accent hover:text-accent-dark transition-colors"
        >
          + Add new address
        </button>
      )}
    </section>
  );
}
