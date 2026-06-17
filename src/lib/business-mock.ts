import type {BusinessResource} from "@biz11/Types/Api";

const business: BusinessResource = {
  nanoId: "biz_demo_01",
  name: "Biz11",
  currency: "NPR",
  timezone: "Asia/Kathmandu",
};

export function getBusiness(): BusinessResource {
  return business;
}

export function formatPrice(
  price: string,
  currency: string = "USD",
): string {
	return `${currency} ${price}`;
}
