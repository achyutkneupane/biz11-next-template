import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getPage, ApiError } from "@biz11/lib/api-client";
import { generateSeoMetadata } from "@biz11/lib/seo";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  try {
    const response = await getPage(slug);
    const page = response.data;
    if (page.seo) {
      return generateSeoMetadata(page.seo, await parent);
    }
    return {
      title: page.title,
      description: page.description,
    };
  } catch (error) {
    return {
      title: "Page Not Found",
    };
  }
}

export default async function StaticPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const response = await getPage(slug);
    const page = response.data;

    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-primary sm:text-4xl mb-8">
          {page.title}
        </h1>
        {page.cover && (
          <div className="mb-10 overflow-hidden rounded-2xl">
            <img src={page.cover} alt={page.title} className="w-full object-cover" />
          </div>
        )}
        <div 
          className="prose prose-lg max-w-none text-muted"
          dangerouslySetInnerHTML={{ __html: page.content ?? "" }}
        />
        {page.seo?.schema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(page.seo.schema) }}
          />
        )}
      </div>
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}
