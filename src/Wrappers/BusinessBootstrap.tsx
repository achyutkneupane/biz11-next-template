"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@biz11/store";
import { selectIsBizLoaded } from "@biz11/store/business/selectors";
import { setVisitorFromHeaders } from "@biz11/lib/visitor";
import type { BusinessResource } from "@biz11/Types/Api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

function BootstrapInner() {
  const isLoaded = useStore(selectIsBizLoaded);
  const setBusiness = useStore((s) => s.setBusiness);

  const { data } = useQuery({
    queryKey: ["business"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/v1/business`);
      setVisitorFromHeaders(res.headers);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || body.title || "Business fetch failed");
      }
      const json = await res.json() as { data: BusinessResource };
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
