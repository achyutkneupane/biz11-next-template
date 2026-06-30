"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi2";

type QuantityInputProps = {
  value?: number;
  min?: number;
  max: number;
  onChange?: (value: number) => void;
};

export function QuantityInput({
  value: controlledValue,
  min = 1,
  max,
  onChange,
}: QuantityInputProps) {
  const [internalValue, setInternalValue] = useState(min);
  const value = controlledValue ?? internalValue;

  const decrement = () => {
    const next = Math.max(min, value - 1);
    if (controlledValue === undefined) setInternalValue(next);
    onChange?.(next);
  };

  const increment = () => {
    const next = Math.min(max, value + 1);
    if (controlledValue === undefined) setInternalValue(next);
    onChange?.(next);
  };

  return (
    <div className="inline-flex items-center overflow-hidden rounded-xl border-2 border-border bg-surface">
      <button
        onClick={decrement}
        disabled={value <= min}
        className={clsx(
          "flex h-9 w-9 items-center justify-center transition-colors duration-200 cursor-pointer",
          value <= min
            ? "text-muted-light cursor-not-allowed"
            : "text-foreground hover:bg-border-light active:bg-border",
        )}
        aria-label="Decrease quantity"
      >
        <HiOutlineMinus className="h-3.5 w-3.5" />
      </button>
      <span
        role="spinbutton"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label="Quantity"
        className="flex h-9 min-w-[2.5rem] items-center justify-center border-x-2 border-border text-sm font-bold text-foreground"
      >
        {value}
      </span>
      <button
        onClick={increment}
        disabled={value >= max}
        className={clsx(
          "flex h-9 w-9 items-center justify-center transition-colors duration-200 cursor-pointer",
          value >= max
            ? "text-muted-light cursor-not-allowed"
            : "text-foreground hover:bg-border-light active:bg-border",
        )}
        aria-label="Increase quantity"
      >
        <HiOutlinePlus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
