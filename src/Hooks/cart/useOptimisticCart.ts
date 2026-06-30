"use client";

import { useStore } from "@biz11/store";
import {
  selectCartItems,
  selectCartCount,
  selectCartSubtotal,
} from "@biz11/store/cart/selectors";
import { useCart, useAddToCart, useUpdateCartItem, useRemoveCartItem } from "@biz11/Hooks/cart/useCart";
import type { CartItemResource } from "@biz11/Types/Api";

const CART_KEY = ["cart"];

export function useOptimisticCart() {
  const addItem = useStore((s) => s.addItem);
  const updateQuantity = useStore((s) => s.updateQuantity);
  const removeItem = useStore((s) => s.removeItem);
  const setCartItems = useStore((s) => s.setCartItems);

  const items = useStore(selectCartItems);
  const count = useStore(selectCartCount);
  const subtotal = useStore(selectCartSubtotal);

  const useCartQuery = useCart();
  const addToCart = useAddToCart();
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveCartItem();

  const add = (item: { skuNanoId: string; quantity: number; name: string; price: string; coverUrl: string; skuCode: string }) => {
    const optimistic: CartItemResource = {
      id: Date.now(),
      skuId: 0,
      productName: item.name,
      skuCode: item.skuCode,
      coverUrl: item.coverUrl,
      unitPrice: item.price,
      quantity: item.quantity,
      subtotal: parseFloat(item.price) * item.quantity,
    };
    addItem(optimistic);
    addToCart.mutate({ skuNanoId: item.skuNanoId, quantity: item.quantity });
  };

  const update = (id: number, quantity: number) => {
    const previous = items.find((i) => i.id === id);
    updateQuantity(id, quantity);
    updateCartItem.mutate(
      { id, quantity },
      {
        onError: () => {
          if (previous) updateQuantity(id, previous.quantity);
        },
      },
    );
  };

  const remove = (id: number) => {
    removeCartItem.mutate(id);
  };

  return {
    items,
    count,
    subtotal,
    isLoading: useCartQuery.isLoading,
    isPending: useCartQuery.isPending,
    add,
    update,
    remove,
    refresh: () => setCartItems(useCartQuery.data?.data ?? []),
  };
}
