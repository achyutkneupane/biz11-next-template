"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { HiChevronRight, HiChevronDown } from "react-icons/hi2";
import type { Category } from "@biz11/lib/mock-data";

type CategoryTreeProps = {
  categories: Category[];
  selectedSlug?: string;
  onSelect: (slug: string | undefined) => void;
};

function TreeNode({
  category,
  depth,
  selectedSlug,
  onSelect,
}: {
  category: Category;
  depth: number;
  selectedSlug?: string;
  onSelect: (slug: string | undefined) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 1);
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = selectedSlug === category.slug;

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) setExpanded(!expanded);
          onSelect(category.slug);
        }}
        className={clsx(
          "flex w-full items-center gap-1.5 rounded-lg px-3 py-2 text-left text-sm transition-colors duration-200 cursor-pointer",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
          isSelected
            ? "bg-primary-light/10 font-medium text-primary"
            : "text-foreground hover:bg-border-light",
        )}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        {hasChildren && (
          <span className="shrink-0 text-muted">
            {expanded ? (
              <HiChevronDown className="h-3.5 w-3.5" />
            ) : (
              <HiChevronRight className="h-3.5 w-3.5" />
            )}
          </span>
        )}
        {!hasChildren && <span className="w-3.5 shrink-0" />}
        {category.name}
      </button>
      {hasChildren && expanded && (
        <div>
          {category.children!.map((child) => (
            <TreeNode
              key={child.id}
              category={child}
              depth={depth + 1}
              selectedSlug={selectedSlug}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CategoryTree({
  categories,
  selectedSlug,
  onSelect,
}: CategoryTreeProps) {
  return (
    <div>
      <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
        Categories
      </h3>
      {categories.map((category) => (
        <TreeNode
          key={category.id}
          category={category}
          depth={0}
          selectedSlug={selectedSlug}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
