import { useMemo } from "react";
import { brands } from "@biz11/lib/mock-data";
import type { BrandResource } from "@biz11/Types/Api";

export function useBrands() {
  const data = useMemo<BrandResource[]>(() => brands, []);

  return { data, isLoading: false, error: null };
}

export function useBrand(nanoId: string | null) {
  const data = useMemo<BrandResource | undefined>(
    () => (nanoId ? brands.find((b) => b.nanoId === nanoId) : undefined),
    [nanoId],
  );

  return { data, isLoading: false, error: null };
}
