import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@biz11/lib/api-client";
import { useStore } from "@biz11/store";
import { selectIsBizLoaded } from "@biz11/store/business/selectors";
import type { ProductResource } from "@biz11/Types/Api";

export type SortMode = "featured" | "latest" | "popular";

export type ProductFilters = {
  categoryId?: number;
  brandId?: number;
  search?: string;
  sort?: SortMode;
};

function clientSideFilter(
  products: ProductResource[],
  filters: ProductFilters,
): ProductResource[] {
  let result = products;

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q),
    );
  }

  return result;
}

export function useFeaturedProducts() {
  const isBizLoaded = useStore(selectIsBizLoaded);

  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: () =>
      apiGet<ProductResource[]>("/v1/products/featured", {
        params: { perPage: 12 },
      }),
    enabled: isBizLoaded,
  });
}

export function useLatestProducts() {
  const isBizLoaded = useStore(selectIsBizLoaded);

  return useQuery({
    queryKey: ["products", "latest"],
    queryFn: () =>
      apiGet<ProductResource[]>("/v1/products/latest", {
        params: { perPage: 12 },
      }),
    enabled: isBizLoaded,
  });
}

export function useProducts(filters: ProductFilters) {
  const isBizLoaded = useStore(selectIsBizLoaded);

  const allProducts = useQuery({
    queryKey: ["products", "list", { brandId: filters.brandId, categoryId: filters.categoryId }],
    queryFn: () =>
      apiGet<ProductResource[]>("/v1/products", {
        params: {
          brand_id: filters.brandId,
          category_id: filters.categoryId,
          perPage: 50,
        },
      }),
    enabled: isBizLoaded,
  });

  const filtered = useMemo(() => {
    if (!allProducts.data?.data) return [];
    return clientSideFilter(allProducts.data.data, filters);
  }, [allProducts.data, filters.search]);

  return {
    data: filtered,
    total: filtered.length,
    featured: allProducts.data?.data ?? [],
    isLoading: allProducts.isLoading,
    error: allProducts.error,
  };
}

export function useProduct(slug: string) {
  const isBizLoaded = useStore(selectIsBizLoaded);

  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => apiGet<ProductResource>(`/v1/products/${slug}`),
    enabled: isBizLoaded,
  });
}

export function useRelatedProducts(product: ProductResource | null) {
  const isBizLoaded = useStore(selectIsBizLoaded);

  const allProducts = useQuery({
    queryKey: ["products", "list"],
    queryFn: () =>
      apiGet<ProductResource[]>("/v1/products", {
        params: { perPage: 50 },
      }),
    enabled: !!product && isBizLoaded,
  });

  return useMemo(() => {
    if (!product || !allProducts.data?.data) {
      return { data: [] as ProductResource[], isLoading: allProducts.isLoading, error: null };
    }
    return {
      data: allProducts.data.data
        .filter(
          (p) =>
            p.categories.some((c) =>
              product.categories.some((pc) => pc.nanoId === c.nanoId),
            ) && p.nanoId !== product.nanoId,
        )
        .slice(0, 3),
      isLoading: false,
      error: null,
    };
  }, [product, allProducts.data]);
}
