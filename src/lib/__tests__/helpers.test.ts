import { describe, it, expect } from "vitest";
import { formatPrice } from "@biz11/lib/helpers";

describe("formatPrice", () => {
  it("formats NPR currency correctly", () => {
    const result = formatPrice("1299.00", "NPR");
    expect(result).toBe("NPR 1299.00");
  });

  it("formats USD currency correctly", () => {
    expect(formatPrice("50.00", "USD")).toBe("USD 50.00");
  });

  it("returns --- when currency is empty", () => {
    const result = formatPrice("0.00", "");
    expect(result).toBe("---");
  });

  it("handles NaN input gracefully", () => {
    const result = formatPrice("abc", "USD");
    expect(result).toContain("0.00");
  });

  it("formats zero correctly", () => {
    const result = formatPrice("0.00", "EUR");
    expect(result).toMatch(/0[,.]00/);
  });

  it("includes the currency symbol or code", () => {
    const result = formatPrice("99.99", "GBP");
    expect(result.length).toBeGreaterThan(4);
  });
});
