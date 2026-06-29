import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CART_KEY });
      toast.success("Added to cart");
    },
    onError: () => {
      toast.error("Failed to add to cart");
    },
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      updateCartItemApi(id, quantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
    onError: () => toast.error("Failed to update cart"),
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => removeCartItemApi(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CART_KEY });
      toast.success("Item removed");
    },
    onError: () => toast.error("Failed to remove item"),
  });
}
