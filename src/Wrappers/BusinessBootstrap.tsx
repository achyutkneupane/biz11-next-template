"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@biz11/store";
import { selectIsBizLoaded } from "@biz11/store/business/selectors";
import type { BusinessResource } from "@biz11/Types/Api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

function getStoredVisitorHeaders(): Record<string, string> {
  if (typeof sessionStorage === "undefined") return {};

  const id = sessionStorage.getItem("visitor_id");
  const sig = sessionStorage.getItem("visitor_signature");

  if (!id || !sig) return {};

  return { "X-Visitor-Id": id, "X-Visitor-Signature": sig };
}

function storeVisitorTokens(id: string, sig: string): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem("visitor_id", id);
  sessionStorage.setItem("visitor_signature", sig);
}

function BootstrapInner() {
  const isLoaded = useStore(selectIsBizLoaded);
  const setBusiness = useStore((s) => s.setBusiness);

  const { data, error } = useQuery({
    queryKey: ["business"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/v1/business`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...getStoredVisitorHeaders(),
        },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || body.title || "Business fetch failed");
      }

      const json: { data: BusinessResource } = await res.json();

      storeVisitorTokens(json.data.visitorId, json.data.visitorSignature);

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
