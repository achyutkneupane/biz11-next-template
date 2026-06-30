"use client";

import { HiOutlineXMark, HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";
import { clsx } from "clsx";

export function _ActiveFilters({
  selectedCategory,
  selectedBrands,
  search,
  catsData,
  brandsData,
  onClearCategory,
  onClearBrand,
  onClearSearch,
  onClearAll,
}: {
  selectedCategory: string | undefined;
  selectedBrands: string[];
  search: string;
  catsData: readonly { nanoId: string | null; name: string; slug: string; children?: any[] }[];
  brandsData: readonly { nanoId: string | null; name: string }[];
  onClearCategory: () => void;
  onClearBrand: (nanoId: string) => void;
  onClearSearch: () => void;
  onClearAll: () => void;
}) {
  const hasAny = !!(selectedCategory || selectedBrands.length > 0 || search);
  if (!hasAny) return null;

  function findCat(id: string, list: typeof catsData): string | undefined {
    for (const c of list) {
      if (c.nanoId === id || c.slug === id) return c.name;
      if (c.children) {
        const found = findCat(id, c.children);
        if (found) return found;
      }
    }
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted">Active filters:</span>
      {search && (
        <button onClick={onClearSearch}
          className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3.5 py-1.5 text-xs font-semibold text-accent transition-colors duration-200 hover:bg-accent/20 cursor-pointer"
        >
          Search: &ldquo;{search}&rdquo;
          <HiOutlineXMark className="h-3.5 w-3.5" />
        </button>
      )}
      {selectedCategory && (() => {
        const name = findCat(selectedCategory, catsData);
        return (
          <button onClick={onClearCategory}
            className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3.5 py-1.5 text-xs font-semibold text-accent transition-colors duration-200 hover:bg-accent/20 cursor-pointer"
          >
            {name || selectedCategory}
            <HiOutlineXMark className="h-3.5 w-3.5" />
          </button>
        );
      })()}
      {selectedBrands.map((nanoId) => {
        const brand = brandsData.find((b) => b.nanoId === nanoId);
        return (
          <button key={nanoId} onClick={() => onClearBrand(nanoId)}
            className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3.5 py-1.5 text-xs font-semibold text-accent transition-colors duration-200 hover:bg-accent/20 cursor-pointer"
          >
            {brand?.name || nanoId}
            <HiOutlineXMark className="h-3.5 w-3.5" />
          </button>
        );
      })}
      <button onClick={onClearAll}
        className="text-xs font-semibold text-muted transition-colors duration-200 hover:text-foreground cursor-pointer"
      >
        Clear all
      </button>
    </div>
  );
}
