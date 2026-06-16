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
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted">
        <Link
          href="/"
          className="transition-colors duration-200 hover:text-foreground"
        >
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link
          href="/products"
          className="transition-colors duration-200 hover:text-foreground"
        >
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-2xl border-2 border-border bg-border-light">
          <span className="text-8xl sm:text-9xl">{product.emoji}</span>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted">
              {product.brand}
            </p>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              {product.name}
            </h1>
          </div>

          <p className="text-3xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </p>

          <p className="leading-relaxed text-muted">{product.description}</p>

          <div className="rounded-xl border-2 border-border p-5">
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Specifications
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key}>
                  <dt className="text-xs font-medium text-muted">{key}</dt>
                  <dd className="mt-0.5 text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="primary" size="lg" className="flex-1">
              Add to Cart
            </Button>
            <Button variant="outline" size="lg" className="flex-1">
              Add to Wishlist
            </Button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-foreground">
            Related Products
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
