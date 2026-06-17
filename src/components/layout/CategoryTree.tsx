"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { HiChevronRight, HiChevronDown } from "react-icons/hi2";
import type { CategoryResource } from "@biz11/Types/Api";

type CategoryTreeProps = {
  categories: CategoryResource[];
  selectedNanoId?: string;
  onSelect: (nanoId: string | undefined) => void;
};

function TreeNode({
  category,
  depth,
  selectedNanoId,
  onSelect,
}: {
  category: CategoryResource;
  depth: number;
  selectedNanoId?: string;
  onSelect: (nanoId: string | undefined) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 1);
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = selectedNanoId === category.nanoId;

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) setExpanded(!expanded);
          onSelect(category.nanoId);
        }}
        className={clsx(
          "flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-200 cursor-pointer",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
          isSelected
            ? "bg-accent/10 font-semibold text-accent"
            : "text-foreground hover:bg-border-light",
        )}
        style={{ paddingLeft: `${12 + depth * 20}px` }}
      >
        {hasChildren && (
          <span className="shrink-0 text-muted-light">
            {expanded ? (
              <HiChevronDown className="h-3.5 w-3.5" />
            ) : (
              <HiChevronRight className="h-3.5 w-3.5" />
            )}
          </span>
        )}
        {!hasChildren && <span className="w-3.5 shrink-0" />}
        <span className="flex-1">{category.name}</span>
        <span className="text-xs text-muted-light">
          {category.productsCount}
        </span>
      </button>
      {hasChildren && expanded && (
        <div>
          {category.children!.map((child) => (
            <TreeNode
              key={child.nanoId}
              category={child}
              depth={depth + 1}
              selectedNanoId={selectedNanoId}
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
  selectedNanoId,
  onSelect,
}: CategoryTreeProps) {
  return (
    <div>
      <h3 className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
        Categories
      </h3>
      <div className="space-y-0.5">
        <button
          onClick={() => onSelect(undefined)}
          className={clsx(
            "w-full rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-200 cursor-pointer",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            !selectedNanoId
              ? "bg-accent/10 font-semibold text-accent"
              : "text-foreground hover:bg-border-light",
          )}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <TreeNode
            key={category.nanoId}
            category={category}
            depth={0}
            selectedNanoId={selectedNanoId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
