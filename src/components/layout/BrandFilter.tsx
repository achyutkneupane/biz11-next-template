"use client";

import { clsx } from "clsx";
import type { BrandResource } from "@biz11/Types/Api";

type BrandFilterProps = {
  brands: BrandResource[];
  selectedBrands: string[];
  onToggle: (nanoId: string) => void;
};

export function BrandFilter({
  brands,
  selectedBrands,
  onToggle,
}: BrandFilterProps) {
  return (
    <div>
      <h3 className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
        Brands
      </h3>
      <div className="space-y-1">
        {brands.map((brand) => {
          const id = brand.nanoId ?? brand.slug;
          const isChecked = selectedBrands.includes(id);
          return (
            <label
              key={id}
              className={clsx(
                "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-200",
                "hover:bg-border-light",
                isChecked && "bg-accent/5",
              )}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(id)}
                className="h-4 w-4 rounded border-2 border-muted-light text-accent accent-accent focus:ring-accent focus:ring-offset-1"
              />
              <span className="flex-1 text-foreground">{brand.name}</span>
              <span className="text-xs text-muted-light">
                {brand.productsCount}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
