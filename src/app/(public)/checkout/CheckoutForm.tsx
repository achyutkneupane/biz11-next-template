"use client";

import { useState } from "react";
import { useMe } from "@biz11/Hooks/auth/useAuth";
import { useCheckout } from "@biz11/Hooks/cart/useCheckout";
import { Input } from "@biz11/components/ui/Input";
import { Button } from "@biz11/components/ui/Button";
import { AddressSelection } from "./AddressSelection";
import { OrderSummary } from "./OrderSummary";

export function CheckoutForm() {
  const { data: me } = useMe();
  const isAuthenticated = !!me;
  const checkout = useCheckout();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingAddressId, setShippingAddressId] = useState<number | null>(null);
  const [billingAddressId, setBillingAddressId] = useState<number | null>(null);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [createAccount, setCreateAccount] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddressId) return;

    checkout.mutate({
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      shipping_address_id: shippingAddressId,
      billing_address_id: sameAsShipping ? shippingAddressId : (billingAddressId ?? shippingAddressId),
      create_account: createAccount && !isAuthenticated,
    });
  };

  const disabled = checkout.isPending || !shippingAddressId || !name || !email || !phone;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section>
        <h2 className="mb-4 text-lg font-bold text-foreground">Customer Info</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Phone"
            type="tel"
            required
            className="sm:col-span-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </section>

      <AddressSelection
        title="Shipping Address"
        selectedId={shippingAddressId}
        onSelect={setShippingAddressId}
      />

      <section>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={sameAsShipping}
            onChange={(e) => setSameAsShipping(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-primary"
          />
          Same as shipping address
        </label>
      </section>

      {!sameAsShipping && (
        <AddressSelection
          title="Billing Address"
          selectedId={billingAddressId}
          onSelect={setBillingAddressId}
        />
      )}

      <OrderSummary />

      {!isAuthenticated && (
        <section>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={createAccount}
              onChange={(e) => setCreateAccount(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            Create an account (you can set a password later)
          </label>
        </section>
      )}

      <Button
        variant="primary"
        size="lg"
        type="submit"
        className="w-full"
        disabled={disabled}
      >
        {checkout.isPending ? "Placing order..." : "Place Order"}
      </Button>
    </form>
  );
}
