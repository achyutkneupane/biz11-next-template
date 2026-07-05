import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAddress } from "@biz11/lib/api-client";
import { toast } from "react-toastify";
import type { AddressInput } from "@biz11/Types/Api";

const ADDRESSES_KEY = ["addresses"];

export function useCreateAddress() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: AddressInput) => createAddress(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADDRESSES_KEY });
      toast.success("Address added");
    },
    onError: () => {
      toast.error("Failed to add address");
    },
  });
}
