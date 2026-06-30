import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { checkout as checkoutApi } from "@biz11/lib/api-client";
import type { CheckoutInput } from "@biz11/Types/Api";

export function useCheckout() {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: CheckoutInput) => checkoutApi(body),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      qc.invalidateQueries({ queryKey: ["me"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      router.push(`/checkout/${data.data.order.nanoId}/payment`);
    },
  });
}
