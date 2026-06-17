"use client";

import Link from "next/link";
import { Button } from "@biz11/components/ui/Button";
import { ProductCard } from "@biz11/components/ui/ProductCard";
import { ProductGridSkeleton } from "@biz11/components/Skeletons/ProductGridSkeleton";
import { useFeaturedProducts, useLatestProducts } from "@biz11/Hooks/products/useProducts";
import { useCategories } from "@biz11/Hooks/categories/useCategories";
import { useBusiness } from "@biz11/Hooks/useBusiness";

export default function LandingPage() {
  const business = useBusiness();
  const featuredQuery = useFeaturedProducts();
  const latestQuery = useLatestProducts();
  const { data: cats } = useCategories();

  const latestProducts = (latestQuery.data?.data ?? []).slice(0, 8);
  const featuredProducts = (featuredQuery.data?.data ?? []).slice(0, 8);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary to-primary-light">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#CA8A04_0%,_transparent_50%)] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_#CA8A04_0%,_transparent_50%)] opacity-10" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white/80 backdrop-blur-sm">
            Multi-tenant e-commerce platform
          </span>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Discover products that
            <br />
            <span className="text-accent">elevate your everyday</span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-white/70 sm:text-xl">
            {business.name} connects you with curated products from trusted brands
            worldwide. Shop smarter, live better.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/products">
              <Button variant="secondary" size="lg">
                Browse Products
              </Button>
            </Link>
            <Link href="/products">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white hover:text-primary"
              >
                View Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
              Latest
            </span>
            <h2 className="mt-1 text-3xl font-black text-primary sm:text-4xl">
              New Arrivals
            </h2>
            <p className="mt-1 text-sm text-muted">
              Fresh from our catalog
            </p>
          </div>
          <Link
            href="/products"
            className="hidden items-center gap-1 text-sm font-semibold text-accent transition-colors duration-200 hover:text-accent-dark sm:flex"
          >
            View all
            <span className="text-lg leading-none">&rarr;</span>
          </Link>
        </div>
        {latestQuery.isLoading ? (
          <ProductGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {latestProducts.map((product) => (
              <ProductCard key={product.nanoId ?? product.slug} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                Featured
              </span>
              <h2 className="mt-1 text-3xl font-black text-primary sm:text-4xl">
                Featured Products
              </h2>
              <p className="mt-1 text-sm text-muted">
                Our curated picks for you
              </p>
            </div>
            <Link
              href="/products"
              className="hidden items-center gap-1 text-sm font-semibold text-accent transition-colors duration-200 hover:text-accent-dark sm:flex"
            >
              View all
              <span className="text-lg leading-none">&rarr;</span>
            </Link>
          </div>
          {featuredQuery.isLoading ? (
            <ProductGridSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product.nanoId ?? product.slug} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {cats.filter((c) => c.productsCount > 0).map((cat) => {
        const catProducts = (featuredQuery.data?.data ?? [])
          .filter((p) => p.categories.some((c2) => c2.nanoId === cat.nanoId))
          .slice(0, 6);
        if (catProducts.length === 0) return null;

        return (
          <section key={cat.nanoId ?? cat.slug} className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                  {cat.name}
                </span>
                <h2 className="mt-1 text-3xl font-black text-primary sm:text-4xl">
                  {cat.description || `Shop ${cat.name}`}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {cat.productsCount} product{cat.productsCount !== 1 ? "s" : ""}
                </p>
              </div>
              <Link
                href={`/products`}
                className="hidden items-center gap-1 text-sm font-semibold text-accent transition-colors duration-200 hover:text-accent-dark sm:flex"
              >
                Browse {cat.name}
                <span className="text-lg leading-none">&rarr;</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {catProducts.map((product) => (
                <ProductCard key={product.nanoId ?? product.slug} product={product} />
              ))}
            </div>
          </section>
        );
      })}

      <section className="border-t border-border bg-gradient-to-b from-surface to-background py-20 text-center">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
            Ready to explore?
          </span>
          <h2 className="mt-1 text-3xl font-black text-primary sm:text-4xl">
            Everything you need, all in one place
          </h2>
          <p className="mt-2 text-muted">
            Browse our full catalog of curated products from trusted brands.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/products">
              <Button variant="primary" size="lg">
                Browse All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
