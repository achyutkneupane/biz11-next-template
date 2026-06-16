import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, products } from "@biz11/lib/mock-data";
import { Button } from "@biz11/components/ui/Button";
import { ProductCard } from "@biz11/components/ui/ProductCard";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const related = products
    .filter(
      (p) =>
        p.categories.some((c) =>
          product.categories.some((pc) => pc.nanoId === c.nanoId),
        ) && p.nanoId !== product.nanoId,
    )
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-8 text-sm">
        <Link
          href="/"
          className="font-medium text-muted transition-colors duration-200 hover:text-primary"
        >
          Home
        </Link>
        <span className="mx-2 text-muted-light">/</span>
        <Link
          href="/products"
          className="font-medium text-muted transition-colors duration-200 hover:text-primary"
        >
          Products
        </Link>
        <span className="mx-2 text-muted-light">/</span>
        <span className="font-semibold text-primary">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-border-light shadow-lg">
          <img
            src={product.coverUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
              {product.brand.name}
            </span>
            <h1 className="mt-1 text-3xl font-black text-primary sm:text-4xl">
              {product.name}
            </h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.categories.map((cat) => (
                <span
                  key={cat.nanoId}
                  className="rounded-full bg-border-light px-3.5 py-1 text-xs font-medium text-muted"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </div>

          <p className="text-4xl font-black text-primary">
            ${product.defaultSku.price}
          </p>

          <p className="leading-relaxed text-muted">
            {product.description}
          </p>

          <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {product.defaultSku.quantity > 0
                  ? `In Stock (${product.defaultSku.quantity} available)`
                  : "Out of Stock"}
              </p>
              <p className="text-xs text-muted">SKU: {product.defaultSku.skuCode}</p>
            </div>
          </div>

          {product.specifications && product.specifications.length > 0 && (
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold tracking-wide text-primary">
                Specifications
              </h3>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                {product.specifications.map((spec: any, i: number) => (
                  <div key={i}>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                      {spec.key}
                    </dt>
                    <dd className="mt-0.5 text-sm font-medium text-foreground">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button variant="primary" size="lg" className="flex-1">
              Add to Cart &mdash; ${product.defaultSku.price}
            </Button>
            <Button variant="outline" size="lg" className="flex-1">
              Add to Wishlist
            </Button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
              You might also like
            </span>
            <h2 className="mt-1 text-2xl font-black text-primary">
              Related Products
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.nanoId} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
