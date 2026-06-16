"use client";

import { useState, useMemo } from "react";
import { HiOutlineAdjustmentsHorizontal, HiOutlineXMark } from "react-icons/hi2";
import { ProductCard } from "@biz11/components/ui/ProductCard";
import { CategoryTree } from "@biz11/components/layout/CategoryTree";
import { BrandFilter } from "@biz11/components/layout/BrandFilter";
import { categories, brands, products } from "@biz11/lib/mock-data";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleBrand = (nanoId: string) => {
    setSelectedBrands((prev) =>
      prev.includes(nanoId) ? prev.filter((s) => s !== nanoId) : [...prev, nanoId],
    );
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (
        selectedCategory &&
        !p.categories.some((c) => c.nanoId === selectedCategory)
      )
        return false;
      if (
        selectedBrands.length > 0 &&
        !selectedBrands.includes(p.brand.nanoId!)
      )
        return false;
      return true;
    });
  }, [selectedCategory, selectedBrands]);

  const activeFilterCount =
    (selectedCategory ? 1 : 0) + selectedBrands.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
            Browsing
          </span>
          <h1 className="mt-1 text-3xl font-black text-primary sm:text-4xl">
            All Products
          </h1>
          <p className="mt-1 text-sm text-muted">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="relative flex h-11 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground shadow-sm transition-all duration-200 hover:border-muted-light hover:shadow-md lg:hidden cursor-pointer"
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

      <div className="flex gap-10">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 space-y-8">
            <CategoryTree
              categories={categories}
              selectedNanoId={selectedCategory}
              onSelect={setSelectedCategory}
            />
            <div className="border-t border-border pt-8">
              <BrandFilter
                brands={brands}
                selectedBrands={selectedBrands}
                onToggle={toggleBrand}
              />
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {activeFilterCount > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted">Active filters:</span>
              {selectedCategory && (() => {
                function findCat(
                  nanoId: string,
                  cats: typeof categories,
                ): string | undefined {
                  for (const c of cats) {
                    if (c.nanoId === nanoId) return c.name;
                    if (c.children) {
                      const found = findCat(nanoId, c.children);
                      if (found) return found;
                    }
                  }
                }
                const name = findCat(selectedCategory, categories);
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
                const brand = brands.find((b) => b.nanoId === nanoId);
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
                }}
                className="text-xs font-semibold text-muted transition-colors duration-200 hover:text-foreground cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
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
                Try adjusting your filters to see more results.
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
                categories={categories}
                selectedNanoId={selectedCategory}
                onSelect={(nanoId) => {
                  setSelectedCategory(nanoId);
                  setSidebarOpen(false);
                }}
              />
              <div className="border-t border-border pt-8">
                <BrandFilter
                  brands={brands}
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
