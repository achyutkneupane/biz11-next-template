import { useQuery } from "@tanstack/react-query";
import { getAddresses } from "@biz11/lib/api-client";
import type { AddressResource } from "@biz11/Types/Api";

const ADDRESSES_KEY = ["addresses"];

export function useAddresses() {
  return useQuery({
    queryKey: ADDRESSES_KEY,
    queryFn: () => getAddresses(),
    select: (res) => res.data,
  });
}
