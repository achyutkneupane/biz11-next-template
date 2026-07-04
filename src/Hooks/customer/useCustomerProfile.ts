import { useQuery } from "@tanstack/react-query";
import { useStore } from "@biz11/store";
import { selectIsBizLoaded } from "@biz11/store/business/selectors";
import { getCustomerProfile } from "@biz11/lib/api-client";

const CUSTOMER_PROFILE_KEY = ["customer_profile"];

export function useCustomerProfile() {
  const isBizLoaded = useStore(selectIsBizLoaded);

  return useQuery({
    queryKey: CUSTOMER_PROFILE_KEY,
    queryFn: () => getCustomerProfile(),
    select: (res) => res.data,
    enabled: isBizLoaded,
  });
}
