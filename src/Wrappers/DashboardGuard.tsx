"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@biz11/Hooks/auth/useAuth";

export function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useMe();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center animate-pulse">
        <p className="text-sm text-muted">Loading account details...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
