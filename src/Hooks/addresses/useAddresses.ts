import { useQuery } from "@tanstack/react-query";
import { useStore } from "@biz11/store";
import { selectIsBizLoaded } from "@biz11/store/business/selectors";
import { getAddresses } from "@biz11/lib/api-client";

const ADDRESSES_KEY = ["addresses"];

export function useAddresses() {
  const isBizLoaded = useStore(selectIsBizLoaded);

  return useQuery({
    queryKey: ADDRESSES_KEY,
    queryFn: () => getAddresses(),
    select: (res) => res.data,
    enabled: isBizLoaded,
  });
}
