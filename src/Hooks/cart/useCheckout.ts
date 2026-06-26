import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { checkout as checkoutApi } from "@biz11/lib/api-client";

export function useCheckout() {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body?: { notes?: string; billing_address_id?: number; shipping_address_id?: number }) =>
      checkoutApi(body),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      router.push(`/checkout/${data.data.order.nanoId}/payment`);
    },
  });
}
