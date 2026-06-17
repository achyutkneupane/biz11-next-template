import { useMemo } from "react";
import { getCategories } from "@biz11/lib/mock-data";
import type { CategoryResource } from "@biz11/Types/Api";

export function useCategories() {
  const data = useMemo<CategoryResource[]>(() => getCategories(), []);

  return { data, isLoading: false, error: null };
}

export function useCategory(nanoId: string | null) {
  const data = useMemo<CategoryResource | undefined>(() => {
    if (!nanoId) return undefined;
    function find(cats: CategoryResource[]): CategoryResource | undefined {
      for (const c of cats) {
        if (c.nanoId === nanoId) return c;
        if (c.children) {
          const found = find(c.children);
          if (found) return found;
        }
      }
    }
    return find(getCategories());
  }, [nanoId]);

  return { data, isLoading: false, error: null };
}
