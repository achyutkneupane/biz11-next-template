import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@biz11/lib/api-client";
import type { CategoryResource } from "@biz11/Types/Api";

export function useCategories() {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiGet<CategoryResource[]>("/v1/categories"),
  });

  return {
    data: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useCategory(slug: string | null) {
  const query = useQuery({
    queryKey: ["category", slug],
    queryFn: () => apiGet<CategoryResource>(`/v1/categories/${slug}`),
    enabled: !!slug,
  });

  return {
    data: query.data?.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
  };
}
