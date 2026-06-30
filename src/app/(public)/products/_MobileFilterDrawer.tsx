"use client";

import { HiOutlineXMark } from "react-icons/hi2";
import { CategoryTree } from "@biz11/components/layout/CategoryTree";
import { BrandFilter } from "@biz11/components/layout/BrandFilter";
import type { CategoryResource } from "@biz11/Types/Api";
import type { BrandResource } from "@biz11/Types/Api";

export function _MobileFilterDrawer({
  open,
  onClose,
  categories,
  selectedCategory,
  onSelectCategory,
  brands,
  selectedBrands,
  onToggleBrand,
}: {
  open: boolean;
  onClose: () => void;
  categories: CategoryResource[];
  selectedCategory: string | undefined;
  onSelectCategory: (id: string | undefined) => void;
  brands: BrandResource[];
  selectedBrands: string[];
  onToggleBrand: (id: string) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 w-72 overflow-y-auto border-r border-border bg-surface p-6 shadow-2xl" role="dialog" aria-modal="true" aria-label="Product filters">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary">Filters</h2>
          <button onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted transition-colors duration-200 hover:bg-border-light hover:text-foreground cursor-pointer"
            aria-label="Close filters"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-8">
          <CategoryTree
            categories={categories}
            selectedNanoId={selectedCategory}
            onSelect={(id) => { onSelectCategory(id); onClose(); }}
          />
          <div className="border-t border-border pt-8">
            <BrandFilter brands={brands} selectedBrands={selectedBrands} onToggle={onToggleBrand} />
          </div>
        </div>
      </div>
    </div>
  );
}
