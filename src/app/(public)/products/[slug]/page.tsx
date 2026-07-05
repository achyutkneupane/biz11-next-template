import { ProductDetail } from "@biz11/components/layout/ProductDetail";
import { Metadata, ResolvingMetadata } from "next";
import { apiGet } from "@biz11/lib/api-client";
import { generateSeoMetadata } from "@biz11/lib/seo";
import type { ProductResource } from "@biz11/Types/Api";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  try {
    const response = await apiGet<ProductResource>(`/v1/products/${slug}`);
    const product = response.data;
    if (product.seo) {
      return generateSeoMetadata(product.seo, await parent);
    }
    return {
      title: product.name,
      description: product.description,
    };
  } catch (error) {
    return {
      title: "Product Not Found",
    };
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductDetail slug={slug} />;
}
