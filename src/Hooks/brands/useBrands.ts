import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@biz11/lib/api-client";
import type { BrandResource } from "@biz11/Types/Api";

export function useBrands() {
  const query = useQuery({
    queryKey: ["brands"],
    queryFn: () =>
      apiGet<BrandResource[]>("/v1/brands", {
        params: { perPage: 100 },
      }),
  });

  return {
    data: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useBrand(slug: string | null) {
  const query = useQuery({
    queryKey: ["brand", slug],
    queryFn: () => apiGet<BrandResource>(`/v1/brands/${slug}`),
    enabled: !!slug,
  });

  return {
    data: query.data?.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
  };
}
