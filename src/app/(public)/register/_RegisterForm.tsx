"use client";

import Link from "next/link";
import { Button } from "@biz11/components/ui/Button";

export function _RegisterForm() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        You can create an account during checkout when you place your first order.
      </p>
      <Link href="/products">
        <Button variant="primary" size="lg" className="w-full">
          Browse Products
        </Button>
      </Link>
      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-accent hover:text-accent-dark">
          Sign In
        </Link>
      </p>
    </div>
  );
}
