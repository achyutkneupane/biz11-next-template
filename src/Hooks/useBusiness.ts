import { useStore } from "@biz11/store";
import {
  selectBusinessName,
  selectCurrency,
  selectIsBizLoaded,
} from "@biz11/store/business/selectors";

export function useBusiness() {
  const name = useStore(selectBusinessName);
  const currency = useStore(selectCurrency);
  const isLoaded = useStore(selectIsBizLoaded);

  return {
    name,
    currency,
    isLoaded,
    isBusinessLoaded: isLoaded && !!name,
    isLoading: !isLoaded,
    error: null,
  };
}
