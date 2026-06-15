"use client";

import { useState, useMemo } from "react";
import { HiOutlineAdjustmentsHorizontal, HiOutlineXMark } from "react-icons/hi2";
import { ProductCard } from "@/components/ui/ProductCard";
import { CategoryTree } from "@/components/layout/CategoryTree";
import { BrandFilter } from "@/components/layout/BrandFilter";
import { categories, brands, products } from "@/lib/mock-data";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleBrand = (slug: string) => {
    setSelectedBrands((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory && p.categorySlug !== selectedCategory) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brandSlug))
        return false;
      return true;
    });
  }, [selectedCategory, selectedBrands]);

  const activeFilterCount =
    (selectedCategory ? 1 : 0) + selectedBrands.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Products
          </h1>
          <p className="mt-1 text-sm text-muted">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="relative flex h-10 items-center gap-2 rounded-lg border-2 border-border px-4 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-border-light lg:hidden cursor-pointer"
        >
          <HiOutlineAdjustmentsHorizontal className="h-5 w-5" />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 space-y-6">
            <CategoryTree
              categories={categories}
              selectedSlug={selectedCategory}
              onSelect={setSelectedCategory}
            />
            <div className="border-t border-border-light pt-6">
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
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted">Active filters:</span>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(undefined)}
                  className="flex items-center gap-1 rounded-full bg-primary-light/10 px-3 py-1 text-xs font-medium text-primary transition-colors duration-200 hover:bg-primary-light/20 cursor-pointer"
                >
                  Category: {selectedCategory}
                  <HiOutlineXMark className="h-3.5 w-3.5" />
                </button>
              )}
              {selectedBrands.map((slug) => {
                const brand = brands.find((b) => b.slug === slug);
                return (
                  <button
                    key={slug}
                    onClick={() => toggleBrand(slug)}
                    className="flex items-center gap-1 rounded-full bg-primary-light/10 px-3 py-1 text-xs font-medium text-primary transition-colors duration-200 hover:bg-primary-light/20 cursor-pointer"
                  >
                    Brand: {brand?.name || slug}
                    <HiOutlineXMark className="h-3.5 w-3.5" />
                  </button>
                );
              })}
              <button
                onClick={() => {
                  setSelectedCategory(undefined);
                  setSelectedBrands([]);
                }}
                className="text-xs font-medium text-muted transition-colors duration-200 hover:text-foreground cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="mb-3 text-5xl text-muted-light">🔍</span>
              <h3 className="text-lg font-semibold text-foreground">
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
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 overflow-y-auto border-r-2 border-border bg-surface p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Filters</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors duration-200 hover:bg-border-light cursor-pointer"
                aria-label="Close filters"
              >
                <HiOutlineXMark className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-6">
              <CategoryTree
                categories={categories}
                selectedSlug={selectedCategory}
                onSelect={(slug) => {
                  setSelectedCategory(slug);
                  setSidebarOpen(false);
                }}
              />
              <div className="border-t border-border-light pt-6">
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
