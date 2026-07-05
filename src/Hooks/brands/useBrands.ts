import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@biz11/lib/api-client";
import { useStore } from "@biz11/store";
import { selectIsBizLoaded } from "@biz11/store/business/selectors";
import type { BrandResource } from "@biz11/Types/Api";

export function useBrands() {
  const isBizLoaded = useStore(selectIsBizLoaded);

  const query = useQuery({
    queryKey: ["brands"],
    queryFn: () =>
      apiGet<BrandResource[]>("/v1/brands", {
        params: { perPage: 100 },
      }),
    enabled: isBizLoaded,
  });

  return {
    data: query.data?.data ?? [],
    isLoading: query.isLoading,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
  };
}

export function useBrand(slug: string | null) {
  const isBizLoaded = useStore(selectIsBizLoaded);

  const query = useQuery({
    queryKey: ["brand", slug],
    queryFn: () => apiGet<BrandResource>(`/v1/brands/${slug}`),
    enabled: !!slug && isBizLoaded,
  });

  return {
    data: query.data?.data ?? null,
    isLoading: query.isLoading,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
  };
}
