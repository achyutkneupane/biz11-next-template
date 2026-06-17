import { useMemo } from "react";
import { getBusiness, formatPrice } from "@biz11/lib/business-mock";
import type { BusinessResource } from "@biz11/Types/Api";

export function useBusiness() {
  const data = useMemo<BusinessResource>(() => getBusiness(), []);

  return {
    data,
    formatPrice: (price: string) => formatPrice(price, data.currency),
    isLoading: false,
    error: null,
  };
}
