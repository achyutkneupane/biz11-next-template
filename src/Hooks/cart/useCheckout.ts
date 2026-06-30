import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { checkout as checkoutApi } from "@biz11/lib/api-client";
import { useStore } from "@biz11/store";
import type { CheckoutInput } from "@biz11/Types/Api";

export function useCheckout() {
  const router = useRouter();
  const qc = useQueryClient();
  const setToken = useStore((s) => s.setToken);

  return useMutation({
    mutationFn: (body: CheckoutInput) => checkoutApi(body),
    onSuccess: (data) => {
      if (data.data.token) {
        setToken(data.data.token);
      }
      qc.invalidateQueries({ queryKey: ["cart"] });
      router.push(`/checkout/${data.data.order.nanoId}/payment`);
    },
  });
}
