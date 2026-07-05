"use client";

import { clsx } from "clsx";
import { HiOutlineFire, HiOutlineClock, HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import type { SortMode } from "@biz11/Hooks/products/useProducts";

const sortModes: { key: SortMode; label: string; icon: typeof HiOutlineFire }[] = [
  { key: "all", label: "All", icon: HiOutlineFire },
  { key: "featured", label: "Featured", icon: HiOutlineFire },
  { key: "latest", label: "Latest", icon: HiOutlineClock },
];

export function _ProductToolbar({
  sortMode,
  onSortChange,
  total,
  activeFilterCount,
  onOpenFilters,
}: {
  sortMode: SortMode;
  onSortChange: (mode: SortMode) => void;
  total: number;
  activeFilterCount: number;
  onOpenFilters: () => void;
}) {
  return (
    <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Browsing</span>
        <h1 className="mt-1 text-3xl font-black text-primary sm:text-4xl">All Products</h1>
        <p className="mt-1 text-sm text-muted">
          {total} product{total !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="flex items-center gap-2">
        {sortModes.map((mode) => {
          const Icon = mode.icon;
          return (
            <button
              key={mode.key}
              onClick={() => onSortChange(mode.key)}
              className={clsx(
                "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-200 cursor-pointer",
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
          onClick={onOpenFilters}
          className="relative ml-2 flex h-11 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground shadow-sm transition-colors duration-200 hover:border-muted-light hover:shadow-md cursor-pointer lg:hidden"
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
  );
}
