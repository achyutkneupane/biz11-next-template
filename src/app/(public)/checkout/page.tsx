"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@biz11/store";
import { selectCartItems } from "@biz11/store/cart/selectors";
import { useEffect } from "react";
import { CheckoutForm } from "./CheckoutForm";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useStore(selectCartItems);

  useEffect(() => {
    if (items.length === 0) {
      router.push("/products");
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-black text-primary">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
