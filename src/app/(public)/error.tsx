"use client";

import Link from "next/link";
import { Button } from "@biz11/components/ui/Button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-5 rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <span className="text-5xl">!</span>
      </div>
      <h1 className="mb-3 text-3xl font-black text-primary">Something went wrong</h1>
      <p className="mb-8 max-w-md text-muted">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <div className="flex items-center gap-4">
        <Button variant="primary" size="lg" onClick={reset}>
          Try Again
        </Button>
        <Link href="/">
          <Button variant="outline" size="lg">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
