import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@biz11/lib/api-client";
import { useStore } from "@biz11/store";
import { selectIsBizLoaded } from "@biz11/store/business/selectors";
import type { ProductResource } from "@biz11/Types/Api";

export type SortMode = "all" | "featured" | "latest";

export type ProductFilters = {
  brandId?: number;
  categoryId?: number;
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

export function useFeaturedProducts(cursor?: string) {
  const isBizLoaded = useStore(selectIsBizLoaded);

  return useQuery({
    queryKey: ["products", "featured", cursor],
    queryFn: () =>
      apiGet<ProductResource[]>("/v1/products/featured", {
        params: { perPage: 12, cursor },
      }),
    enabled: isBizLoaded,
  });
}

export function useLatestProducts(cursor?: string) {
  const isBizLoaded = useStore(selectIsBizLoaded);

  return useQuery({
    queryKey: ["products", "latest", cursor],
    queryFn: () =>
      apiGet<ProductResource[]>("/v1/products/latest", {
        params: { perPage: 12, cursor },
      }),
    enabled: isBizLoaded,
  });
}

export function useAllProducts(cursor?: string) {
  const isBizLoaded = useStore(selectIsBizLoaded);

  return useQuery({
    queryKey: ["products", "all", cursor],
    queryFn: () =>
      apiGet<ProductResource[]>("/v1/products", {
        params: { perPage: 12, cursor },
      }),
    enabled: isBizLoaded,
  });
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
