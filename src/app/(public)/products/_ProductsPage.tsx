"use client";

import { useState, useCallback, useId, useMemo } from "react";
import { useDebounce } from "@biz11/Hooks/useDebounce";
import { ProductCard } from "@biz11/components/ui/ProductCard";
import { ProductGridSkeleton } from "@biz11/components/Skeletons/ProductGridSkeleton";
import { CategoryTreeSkeleton } from "@biz11/components/Skeletons/CategoryTreeSkeleton";
import { BrandFilterSkeleton } from "@biz11/components/Skeletons/BrandFilterSkeleton";
import { CategoryTree } from "@biz11/components/layout/CategoryTree";
import { BrandFilter } from "@biz11/components/layout/BrandFilter";
import {
  useAllProducts,
  useFeaturedProducts,
  useLatestProducts,
} from "@biz11/Hooks/products/useProducts";
import { useCategories } from "@biz11/Hooks/categories/useCategories";
import { useBrands } from "@biz11/Hooks/brands/useBrands";
import type { SortMode } from "@biz11/Hooks/products/useProducts";
import { _ProductToolbar } from "@biz11/app/(public)/products/_ProductToolbar";
import { _ProductSearch } from "@biz11/app/(public)/products/_ProductSearch";
import { _ActiveFilters } from "@biz11/app/(public)/products/_ActiveFilters";
import { _ProductPagination } from "@biz11/app/(public)/products/_ProductPagination";
import { _MobileFilterDrawer } from "@biz11/app/(public)/products/_MobileFilterDrawer";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [cursor, setCursor] = useState<string | undefined>();
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);
  const searchId = useId();

  const { data: catsData, isLoading: catsLoading, isPending: catsPending } = useCategories();
  const { data: brandsData, isLoading: brandsLoading, isPending: brandsPending } = useBrands();

  const allQuery = useAllProducts(sortMode === "all" ? cursor : undefined, sortMode === "all");
  const featuredQuery = useFeaturedProducts(sortMode === "featured" ? cursor : undefined, sortMode === "featured");
  const latestQuery = useLatestProducts(sortMode === "latest" ? cursor : undefined, sortMode === "latest");

  const activeQuery =
    sortMode === "latest" ? latestQuery :
    sortMode === "featured" ? featuredQuery :
    allQuery;

  const isLoading =
    sortMode === "latest" ? latestQuery.isLoading :
    sortMode === "featured" ? featuredQuery.isLoading :
    allQuery.isLoading;

  const meta = activeQuery.data?.meta;

  const pool = useMemo(() => {
    switch (sortMode) {
      case "latest": return latestQuery.data?.data ?? [];
      case "featured": return featuredQuery.data?.data ?? [];
      default: return allQuery.data?.data ?? [];
    }
  }, [sortMode, allQuery.data, featuredQuery.data, latestQuery.data]);

  const displayProducts = useMemo(() => {
    let result = pool;
    if (selectedCategory) {
      result = result.filter((p) =>
        p.categories.some((c) => c.nanoId === selectedCategory || c.slug === selectedCategory),
      );
    }
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand.nanoId!));
    }
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [pool, selectedCategory, selectedBrands, debouncedSearch]);

  const handleSortChange = (mode: SortMode) => {
    setSortMode(mode);
    setCursor(undefined);
    setCursorHistory([]);
  };

  const handleNext = () => {
    if (meta?.nextCursor) {
      setCursorHistory((prev) => [...prev, cursor ?? ""]);
      setCursor(meta.nextCursor);
    }
  };

  const handlePrev = () => {
    const prev = cursorHistory[cursorHistory.length - 1];
    setCursorHistory((prev) => prev.slice(0, -1));
    setCursor(prev || undefined);
  };

  const toggleBrand = useCallback((nanoId: string) => {
    setSelectedBrands((prev) =>
      prev.includes(nanoId) ? prev.filter((s) => s !== nanoId) : [...prev, nanoId],
    );
  }, []);

  const from = meta ? (cursorHistory.length * (meta.perPage || 12)) + 1 : 1;
  const to = from + (activeQuery.data?.data?.length ?? 1) - 1;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <_ProductToolbar
        sortMode={sortMode}
        onSortChange={handleSortChange}
        total={displayProducts.length}
        activeFilterCount={(selectedCategory ? 1 : 0) + selectedBrands.length}
        onOpenFilters={() => setSidebarOpen(true)}
      />

      <_ProductSearch value={search} onChange={setSearch} searchId={searchId} />

      <div className="flex gap-10">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 space-y-8">
            {(catsPending || catsLoading) ? <CategoryTreeSkeleton /> : (
              <CategoryTree categories={catsData} selectedNanoId={selectedCategory} onSelect={setSelectedCategory} />
            )}
            <div className="border-t border-border pt-8">
              {(brandsPending || brandsLoading) ? <BrandFilterSkeleton /> : (
                <BrandFilter brands={brandsData} selectedBrands={selectedBrands} onToggle={toggleBrand} />
              )}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <_ActiveFilters
            selectedCategory={selectedCategory}
            selectedBrands={selectedBrands}
            search={search}
            catsData={catsData}
            brandsData={brandsData}
            onClearCategory={() => setSelectedCategory(undefined)}
            onClearBrand={(id) => toggleBrand(id)}
            onClearSearch={() => setSearch("")}
            onClearAll={() => { setSelectedCategory(undefined); setSelectedBrands([]); setSearch(""); }}
          />

          {isLoading ? (
            <ProductGridSkeleton count={6} />
          ) : displayProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {displayProducts.map((product) => (
                  <ProductCard key={product.nanoId ?? product.slug} product={product} />
                ))}
              </div>

              <_ProductPagination
                from={from}
                to={to}
                total={meta?.total ?? to}
                hasPrev={cursorHistory.length > 0}
                hasNext={!!meta?.hasMore}
                onPrev={handlePrev}
                onNext={handleNext}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-5 rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <span className="text-5xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold text-primary">No products found</h3>
              <p className="mt-1 text-sm text-muted">Try adjusting your search or filters to see more results.</p>
            </div>
          )}
        </div>
      </div>

      <_MobileFilterDrawer
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        categories={catsData}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        brands={brandsData}
        selectedBrands={selectedBrands}
        onToggleBrand={toggleBrand}
      />
    </div>
  );
}
