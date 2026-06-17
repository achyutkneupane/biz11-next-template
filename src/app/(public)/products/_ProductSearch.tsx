"use client";

import { HiOutlineXMark, HiOutlineMagnifyingGlass } from "react-icons/hi2";

export function _ProductSearch({
  value,
  onChange,
  searchId,
}: {
  value: string;
  onChange: (v: string) => void;
  searchId: string;
}) {
  return (
    <div className="mb-8">
      <label htmlFor={searchId} className="sr-only">Search products</label>
      <div className="relative max-w-md">
        <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-light" />
        <input
          id={searchId}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search products, brands..."
          className="h-12 w-full rounded-xl border-2 border-border bg-surface pl-12 pr-4 text-sm text-foreground placeholder:text-muted-light transition-colors duration-200 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>
    </div>
  );
}
