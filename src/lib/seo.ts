import { Metadata, ResolvingMetadata } from "next";
import { SEOData } from "@biz11/Types/Api";

export function generateSeoMetadata(seo: SEOData, parent?: Awaited<ResolvingMetadata>): Metadata {
  return {
    title: seo.title ?? parent?.title?.absolute ?? undefined,
    description: seo.description ?? parent?.description ?? undefined,
    authors: seo.author ? [{ name: seo.author }] : undefined,
    robots: seo.robots ?? undefined,
    alternates: seo.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    openGraph: {
      title: seo.openGraphTitle ?? seo.title ?? parent?.openGraph?.title ?? undefined,
      description: seo.description ?? parent?.openGraph?.description ?? undefined,
      url: seo.url ?? parent?.openGraph?.url ?? undefined,
      type: (seo.type as any) ?? "website",
      images: seo.image ? [{ url: seo.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.openGraphTitle ?? seo.title ?? undefined,
      description: seo.description ?? undefined,
      images: seo.image ? [seo.image] : undefined,
    },
  };
}
