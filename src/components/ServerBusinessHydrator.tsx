"use client";

import { useStore } from "@biz11/store";
import type { BusinessResource } from "@biz11/Types/Api";

export function ServerBusinessHydrator({
  data,
}: {
  data: BusinessResource | null;
}) {
  if (data) {
    useStore.getState().setBusiness(data);
  }

  return null;
}
