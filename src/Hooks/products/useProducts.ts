import { useMemo } from "react";
import {
  products,
  getFeaturedProducts,
  getLatestProducts,
  getPopularProducts,
  getProductBySlug,
} from "@biz11/lib/mock-data";
import type { ProductResource } from "@biz11/Types/Api";

export type SortMode = "featured" | "latest" | "popular";

export type ProductFilters = {
  categoryNanoId?: string;
  brandNanoIds?: string[];
  search?: string;
  sort?: SortMode;
};

function filterProducts(
  filters: ProductFilters,
): ProductResource[] {
  const pool = (() => {
    switch (filters.sort) {
      case "latest":
        return getLatestProducts();
      case "popular":
        return getPopularProducts();
      default:
        return getFeaturedProducts();
    }
  })();

  return pool.filter((p) => {
    if (
      filters.categoryNanoId &&
      !p.categories.some((c) => c.nanoId === filters.categoryNanoId)
    )
      return false;
    if (
      filters.brandNanoIds &&
      filters.brandNanoIds.length > 0 &&
      !filters.brandNanoIds.includes(p.brand.nanoId!)
    )
      return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (
        !p.name.toLowerCase().includes(q) &&
        !p.brand.name.toLowerCase().includes(q) &&
        !p.description?.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });
}

export type UseProductsResult = {
  data: ProductResource[];
  total: number;
  isLoading: boolean;
  error: null;
};

export function useProducts(filters: ProductFilters): UseProductsResult {
  const data = useMemo(() => filterProducts(filters), [
    filters.categoryNanoId,
    filters.brandNanoIds,
    filters.search,
    filters.sort,
  ]);

  return { data, total: data.length, isLoading: false, error: null };
}

export function useProduct(slug: string) {
  const data = useMemo(() => getProductBySlug(slug), [slug]);

  return { data, isLoading: false, error: null };
}

export function useRelatedProducts(product: ProductResource) {
  const data = useMemo(
    () =>
      products.filter(
        (p) =>
          p.categories.some((c) =>
            product.categories.some((pc) => pc.nanoId === c.nanoId),
          ) && p.nanoId !== product.nanoId,
      ).slice(0, 3),
    [product],
  );

  return { data, isLoading: false, error: null };
}
