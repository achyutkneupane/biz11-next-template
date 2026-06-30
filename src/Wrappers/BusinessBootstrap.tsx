"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@biz11/store";
import { selectIsBizLoaded } from "@biz11/store/business/selectors";
import { apiUrl } from "@biz11/lib/api-url";
import type { BusinessResource } from "@biz11/Types/Api";

function BootstrapInner() {
  const isLoaded = useStore(selectIsBizLoaded);
  const setBusiness = useStore((s) => s.setBusiness);

  const { data, error } = useQuery({
    queryKey: ["business"],
    queryFn: async () => {
      const res = await fetch(apiUrl("v1/business").toString(), {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || body.title || "Business fetch failed");
      }

      const json: { data: BusinessResource } = await res.json();

      return json;
    },
    staleTime: Infinity,
    retry: 2,
  });

  useEffect(() => {
    if (data?.data && !isLoaded) {
      setBusiness(data.data);
    }
  }, [data, isLoaded, setBusiness]);

  useEffect(() => {
    if (error) {
      console.error("Business bootstrap failed:", error);
    }
  }, [error]);

  return null;
}

export function BusinessBootstrap({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BootstrapInner />
      {children}
    </>
  );
}
