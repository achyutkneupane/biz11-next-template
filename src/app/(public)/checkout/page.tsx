import { Metadata, ResolvingMetadata } from "next";
import { apiGet } from "@biz11/lib/api-client";
import { generateSeoMetadata } from "@biz11/lib/seo";
import type { StaticPageResource } from "@biz11/Types/Api";
import CheckoutPage from "./_CheckoutPage";

export async function generateMetadata(
  props: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const response = await apiGet<StaticPageResource>("/v1/pages/checkout");
    const page = response.data;
    if (page.seo) {
      return generateSeoMetadata(page.seo, await parent);
    }
  } catch (error) {
    // Fallback
  }
  return {
    title: "Checkout",
  };
}

export default function Page() {
  return <CheckoutPage />;
}
