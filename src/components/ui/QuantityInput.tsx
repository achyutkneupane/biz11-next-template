"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi2";

type QuantityInputProps = {
  min?: number;
  max: number;
  onChange?: (value: number) => void;
};

export function QuantityInput({
  min = 1,
  max,
  onChange,
}: QuantityInputProps) {
  const [value, setValue] = useState(min);

  const decrement = () => {
    setValue((prev) => {
      const next = Math.max(min, prev - 1);
      onChange?.(next);
      return next;
    });
  };

  const increment = () => {
    setValue((prev) => {
      const next = Math.min(max, prev + 1);
      onChange?.(next);
      return next;
    });
  };

  return (
    <div className="inline-flex items-center overflow-hidden rounded-xl border-2 border-border bg-surface">
      <button
        onClick={decrement}
        disabled={value <= min}
        className={clsx(
          "flex h-11 w-11 items-center justify-center transition-colors duration-200 cursor-pointer",
          value <= min
            ? "text-muted-light cursor-not-allowed"
            : "text-foreground hover:bg-border-light active:bg-border",
        )}
        aria-label="Decrease quantity"
      >
        <HiOutlineMinus className="h-4 w-4" />
      </button>
      <span className="flex h-11 min-w-[3rem] items-center justify-center border-x-2 border-border text-sm font-bold text-foreground">
        {value}
      </span>
      <button
        onClick={increment}
        disabled={value >= max}
        className={clsx(
          "flex h-11 w-11 items-center justify-center transition-colors duration-200 cursor-pointer",
          value >= max
            ? "text-muted-light cursor-not-allowed"
            : "text-foreground hover:bg-border-light active:bg-border",
        )}
        aria-label="Increase quantity"
      >
        <HiOutlinePlus className="h-4 w-4" />
      </button>
    </div>
  );
}
