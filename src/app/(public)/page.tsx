import Link from "next/link";
import { Button } from "@biz11/components/ui/Button";
import { ProductCard } from "@biz11/components/ui/ProductCard";
import { getTopProducts } from "@biz11/lib/mock-data";

export default function LandingPage() {
  const topProducts = getTopProducts();

  return (
    <div>
      <section className="border-b-2 border-border bg-surface">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Discover products that
            <span className="text-primary"> elevate your everyday</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
            Biz11 connects you with curated products from trusted brands
            worldwide. Shop smarter, live better.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/products">
              <Button variant="primary" size="lg">
                Browse Products
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" size="lg">
                View Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Top Products
            </h2>
            <p className="mt-1 text-sm text-muted">
              Our most popular picks this season
            </p>
          </div>
          <Link
            href="/products"
            className="hidden text-sm font-medium text-primary transition-colors duration-200 hover:text-primary-dark sm:inline"
          >
            View all &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
