import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@biz11/lib/api-client";
import { useStore } from "@biz11/store";
import { selectIsBizLoaded } from "@biz11/store/business/selectors";
import type { CategoryResource } from "@biz11/Types/Api";

export function useCategories() {
  const isBizLoaded = useStore(selectIsBizLoaded);

  const query = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiGet<CategoryResource[]>("/v1/categories"),
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

export function useCategory(slug: string | null) {
  const isBizLoaded = useStore(selectIsBizLoaded);

  const query = useQuery({
    queryKey: ["category", slug],
    queryFn: () => apiGet<CategoryResource>(`/v1/categories/${slug}`),
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
