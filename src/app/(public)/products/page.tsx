"use client";

import { useState, useCallback, useId, useMemo } from "react";
import { clsx } from "clsx";
import {
  HiOutlineAdjustmentsHorizontal,
  HiOutlineXMark,
  HiOutlineFire,
  HiOutlineClock,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import { ProductCard } from "@biz11/components/ui/ProductCard";
import { CategoryTree } from "@biz11/components/layout/CategoryTree";
import { BrandFilter } from "@biz11/components/layout/BrandFilter";
import {
  useFeaturedProducts,
  useLatestProducts,
  useProducts,
} from "@biz11/Hooks/products/useProducts";
import { useCategories } from "@biz11/Hooks/categories/useCategories";
import { useBrands } from "@biz11/Hooks/brands/useBrands";
import type { SortMode } from "@biz11/Hooks/products/useProducts";

const sortModes: {
  key: SortMode;
  label: string;
  icon: typeof HiOutlineFire;
}[] = [
  { key: "featured", label: "Featured", icon: HiOutlineFire },
  { key: "latest", label: "Latest", icon: HiOutlineClock },
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("featured");
  const [search, setSearch] = useState("");
  const searchId = useId();

  const { data: catsData } = useCategories();
  const { data: brandsData } = useBrands();

  const featuredQuery = useFeaturedProducts();
  const latestQuery = useLatestProducts();

  const pool = useMemo(() => {
    const source =
      sortMode === "latest"
        ? (latestQuery.data?.data ?? [])
        : (featuredQuery.data?.data ?? []);
    return source;
  }, [sortMode, featuredQuery.data, latestQuery.data]);

  const displayProducts = useMemo(() => {
    let result = pool;

    if (selectedCategory) {
      result = result.filter((p) =>
        p.categories.some((c) => c.nanoId === selectedCategory),
      );
    }

    if (selectedBrands.length > 0) {
      result = result.filter((p) =>
        selectedBrands.includes(p.brand.nanoId!),
      );
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [pool, selectedCategory, selectedBrands, search]);

  const toggleBrand = useCallback((nanoId: string) => {
    setSelectedBrands((prev) =>
      prev.includes(nanoId)
        ? prev.filter((s) => s !== nanoId)
        : [...prev, nanoId],
    );
  }, []);

  const activeFilterCount =
    (selectedCategory ? 1 : 0) + selectedBrands.length;

  const isLoading = sortMode === "latest" ? latestQuery.isLoading : featuredQuery.isLoading;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
            Browsing
          </span>
          <h1 className="mt-1 text-3xl font-black text-primary sm:text-4xl">
            All Products
          </h1>
          <p className="mt-1 text-sm text-muted">
            {displayProducts.length} product
            {displayProducts.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="flex items-center gap-2">
          {sortModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.key}
                onClick={() => setSortMode(mode.key)}
                className={clsx(
                  "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer",
                  sortMode === mode.key
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "border border-border bg-surface text-muted hover:border-muted-light hover:text-foreground hover:shadow-sm",
                )}
              >
                <Icon className="h-4 w-4" />
                {mode.label}
              </button>
            );
          })}
          <button
            onClick={() => setSidebarOpen(true)}
            className="relative ml-2 flex h-11 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground shadow-sm transition-all duration-200 hover:border-muted-light hover:shadow-md cursor-pointer lg:hidden"
          >
            <HiOutlineAdjustmentsHorizontal className="h-5 w-5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="mb-8">
        <label htmlFor={searchId} className="sr-only">
          Search products
        </label>
        <div className="relative max-w-md">
          <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-light" />
          <input
            id={searchId}
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, brands..."
            className="h-12 w-full rounded-xl border-2 border-border bg-surface pl-12 pr-4 text-sm text-foreground placeholder:text-muted-light transition-colors duration-200 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      <div className="flex gap-10">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 space-y-8">
            <CategoryTree
              categories={catsData}
              selectedNanoId={selectedCategory}
              onSelect={setSelectedCategory}
            />
            <div className="border-t border-border pt-8">
              <BrandFilter
                brands={brandsData}
                selectedBrands={selectedBrands}
                onToggle={toggleBrand}
              />
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {activeFilterCount > 0 || search ? (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted">Active filters:</span>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3.5 py-1.5 text-xs font-semibold text-accent transition-all duration-200 hover:bg-accent/20 cursor-pointer"
                >
                  Search: &ldquo;{search}&rdquo;
                  <HiOutlineXMark className="h-3.5 w-3.5" />
                </button>
              )}
              {selectedCategory &&
                (() => {
                  function findCat(nanoId: string, list: typeof catsData): string | undefined {
                    for (const c of list) {
                      if (c.nanoId === nanoId) return c.name;
                      if (c.children) {
                        const found = findCat(nanoId, c.children);
                        if (found) return found;
                      }
                    }
                  }
                  const name = findCat(selectedCategory, catsData);
                  return (
                    <button
                      onClick={() => setSelectedCategory(undefined)}
                      className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3.5 py-1.5 text-xs font-semibold text-accent transition-all duration-200 hover:bg-accent/20 cursor-pointer"
                    >
                      {name || selectedCategory}
                      <HiOutlineXMark className="h-3.5 w-3.5" />
                    </button>
                  );
                })()}
              {selectedBrands.map((nanoId) => {
                const brand = brandsData.find((b) => b.nanoId === nanoId);
                return (
                  <button
                    key={nanoId}
                    onClick={() => toggleBrand(nanoId)}
                    className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3.5 py-1.5 text-xs font-semibold text-accent transition-all duration-200 hover:bg-accent/20 cursor-pointer"
                  >
                    {brand?.name || nanoId}
                    <HiOutlineXMark className="h-3.5 w-3.5" />
                  </button>
                );
              })}
              <button
                onClick={() => {
                  setSelectedCategory(undefined);
                  setSelectedBrands([]);
                  setSearch("");
                }}
                className="text-xs font-semibold text-muted transition-colors duration-200 hover:text-foreground cursor-pointer"
              >
                Clear all
              </button>
            </div>
          ) : null}

          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <p className="text-sm text-muted">Loading products...</p>
            </div>
          ) : displayProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {displayProducts.map((product) => (
                <ProductCard key={product.nanoId} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-5 rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <span className="text-5xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold text-primary">
                No products found
              </h3>
              <p className="mt-1 text-sm text-muted">
                Try adjusting your search or filters to see more results.
              </p>
            </div>
          )}
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 overflow-y-auto border-r border-border bg-surface p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary">Filters</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-muted transition-all duration-200 hover:bg-border-light hover:text-foreground cursor-pointer"
                aria-label="Close filters"
              >
                <HiOutlineXMark className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-8">
              <CategoryTree
                categories={catsData}
                selectedNanoId={selectedCategory}
                onSelect={(nanoId) => {
                  setSelectedCategory(nanoId);
                  setSidebarOpen(false);
                }}
              />
              <div className="border-t border-border pt-8">
                <BrandFilter
                  brands={brandsData}
                  selectedBrands={selectedBrands}
                  onToggle={toggleBrand}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
