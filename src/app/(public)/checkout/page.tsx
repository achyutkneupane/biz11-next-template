"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { HiOutlineShieldCheck } from "react-icons/hi2";
import { Breadcrumbs } from "@biz11/components/ui/Breadcrumbs";
import { getAddresses } from "@biz11/lib/api-client";
import { _ShippingForm, type ShippingFormData } from "@biz11/app/(public)/checkout/_ShippingForm";
import { _OrderSummary } from "@biz11/app/(public)/checkout/_OrderSummary";

const emptyForm: ShippingFormData = {
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  createAccount: true,
  email: "",
  password: "",
};

export default function CheckoutPage() {
  const [shipping, setShipping] = useState<ShippingFormData>(emptyForm);
  const [prefilled, setPrefilled] = useState(false);

  const { data: addresses } = useQuery({
    queryKey: ["addresses"],
    queryFn: getAddresses,
  });

  useEffect(() => {
    if (addresses?.data?.length && !prefilled) {
      const addr = addresses.data.find((a) => a.isDefault) || addresses.data[0];
      setShipping({
        ...emptyForm,
        name: addr.name,
        phone: addr.phone || "",
        line1: addr.line1,
        line2: addr.line2 || "",
        city: addr.city,
        state: addr.state || "",
        postalCode: addr.postalCode || "",
      });
      setPrefilled(true);
    }
  }, [addresses, prefilled]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: "Checkout" },
        ]}
      />

      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Secure checkout</span>
        <h1 className="mt-1 text-3xl font-black text-primary sm:text-4xl">Complete Your Order</h1>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
        <div className="space-y-10 lg:col-span-3">
          <_ShippingForm data={shipping} onChange={setShipping} />
          <div className="flex items-center gap-2 text-xs text-muted">
            <HiOutlineShieldCheck className="h-4 w-4 text-accent" />
            Payment processed securely by Stripe on the next step
          </div>
        </div>

        <div className="lg:col-span-2">
          <_OrderSummary shipping={shipping} />
        </div>
      </div>
    </div>
  );
}
