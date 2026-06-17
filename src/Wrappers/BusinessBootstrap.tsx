"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@biz11/lib/api-client";
import { useStore } from "@biz11/store";
import { selectIsBizLoaded } from "@biz11/store/business/selectors";
import type { BusinessResource } from "@biz11/Types/Api";

function BootstrapInner() {
  const isLoaded = useStore(selectIsBizLoaded);
  const setBusiness = useStore((s) => s.setBusiness);

  const { data } = useQuery({
    queryKey: ["business"],
    queryFn: () => apiGet<BusinessResource>("/v1/business", { authenticated: false }),
    staleTime: Infinity,
    retry: 2,
    meta: { skipAuth: true },
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
