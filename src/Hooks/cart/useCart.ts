import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCart,
  addToCart,
  updateCartItem as updateCartItemApi,
  removeCartItem as removeCartItemApi,
} from "@biz11/lib/api-client";

const CART_KEY = ["cart"];

export function useCart() {
  return useQuery({
    queryKey: CART_KEY,
    queryFn: getCart,
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ skuNanoId, quantity }: { skuNanoId: string; quantity: number }) =>
      addToCart(skuNanoId, quantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      updateCartItemApi(id, quantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => removeCartItemApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
  });
}
