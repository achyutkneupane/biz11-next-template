"use client";

import { clsx } from "clsx";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";

export function _ProductPagination({
  from,
  to,
  total,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
}: {
  from: number;
  to: number;
  total: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
      <p className="text-sm text-muted">{from}&ndash;{to} of {total}</p>
      <div className="flex items-center gap-3">
        <button onClick={onPrev} disabled={!hasPrev}
          className={clsx(
            "flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors duration-200",
            !hasPrev
              ? "border-border text-muted-light cursor-not-allowed"
              : "border-border bg-surface text-foreground hover:border-muted-light hover:shadow-sm cursor-pointer",
          )}
        >
          <HiOutlineChevronLeft className="h-4 w-4" />
          Previous
        </button>
        <button onClick={onNext} disabled={!hasNext}
          className={clsx(
            "flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors duration-200",
            !hasNext
              ? "border-border text-muted-light cursor-not-allowed"
              : "border-border bg-surface text-foreground hover:border-muted-light hover:shadow-sm cursor-pointer",
          )}
        >
          Next
          <HiOutlineChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
