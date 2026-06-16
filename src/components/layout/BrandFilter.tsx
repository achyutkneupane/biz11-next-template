"use client";

import { clsx } from "clsx";
import type { Brand } from "@biz11/lib/mock-data";

type BrandFilterProps = {
  brands: Brand[];
  selectedBrands: string[];
  onToggle: (slug: string) => void;
};

export function BrandFilter({
  brands,
  selectedBrands,
  onToggle,
}: BrandFilterProps) {
  return (
    <div>
      <h3 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
        Brands
      </h3>
      <div className="space-y-1">
        {brands.map((brand) => {
          const isChecked = selectedBrands.includes(brand.slug);
          return (
            <label
              key={brand.id}
              className={clsx(
                "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-200",
                "hover:bg-border-light",
              )}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(brand.slug)}
                className="h-4 w-4 rounded border-2 border-border text-primary accent-primary focus:ring-primary focus:ring-offset-1"
              />
              <span className="text-foreground">{brand.name}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
