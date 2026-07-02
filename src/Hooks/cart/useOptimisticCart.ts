"use client";

import { useEffect, useRef, useCallback } from "react";
import { useStore } from "@biz11/store";
import {
  selectCartItems,
  selectCartCount,
  selectCartSubtotal,
} from "@biz11/store/cart/selectors";
import { useCart, useAddToCart, useUpdateCartItem, useRemoveCartItem } from "@biz11/Hooks/cart/useCart";
import type { CartItemResource } from "@biz11/Types/Api";

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

  useEffect(() => {
    if (useCartQuery.data?.data) {
      setCartItems(useCartQuery.data.data);
    }
  }, [useCartQuery.data, setCartItems]);

  const addFn = (item: { skuNanoId: string; quantity: number; name: string; price: string; coverUrl: string; skuCode: string }) => {
    const optimistic: CartItemResource = {
      id: Date.now(),
      skuId: 0,
      productName: item.name,
      skuCode: item.skuCode,
      coverUrl: item.coverUrl,
      unitPrice: item.price,
      quantity: item.quantity,
      subtotal: (parseFloat(item.price) * item.quantity).toFixed(2),
    };
    addItem(optimistic);
    addToCart.mutate(
      { skuNanoId: item.skuNanoId, quantity: item.quantity },
      {
        onError: () => {
          removeItem(optimistic.id);
        },
      },
    );
  };

  const updateFn = (id: number, quantity: number) => {
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

  const removeFn = (id: number) => {
    removeCartItem.mutate(id);
  };

  const handlersRef = useRef({ add: addFn, update: updateFn, remove: removeFn });
  useEffect(() => {
    handlersRef.current = { add: addFn, update: updateFn, remove: removeFn };
  });

  const add = useCallback((...args: Parameters<typeof addFn>) => handlersRef.current.add(...args), []);
  const update = useCallback((...args: Parameters<typeof updateFn>) => handlersRef.current.update(...args), []);
  const remove = useCallback((...args: Parameters<typeof removeFn>) => handlersRef.current.remove(...args), []);

  return {
    items,
    count,
    subtotal,
    isLoading: useCartQuery.isLoading,
    isPending: addToCart.isPending,
    add,
    update,
    remove,
  };
}
