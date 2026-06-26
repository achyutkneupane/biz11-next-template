"use client";

import { useStore } from "@biz11/store";
import type { BusinessResource } from "@biz11/Types/Api";

function storeVisitorTokens(id: string, sig: string): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem("visitor_id", id);
  sessionStorage.setItem("visitor_signature", sig);
}

export function ServerBusinessHydrator({
  data,
  visitorId,
  visitorSignature,
}: {
  data: BusinessResource | null;
  visitorId?: string;
  visitorSignature?: string;
}) {
  if (data) {
    useStore.getState().setBusiness(data);

    if (visitorId && visitorSignature) {
      storeVisitorTokens(visitorId, visitorSignature);
    }
  }

  return null;
}
