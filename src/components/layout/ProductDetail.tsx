"use client";

import Link from "next/link";
import { useBusiness } from "@biz11/Hooks/useBusiness";
import { useProduct, useRelatedProducts } from "@biz11/Hooks/products/useProducts";
import { useStore } from "@biz11/store";
import { selectCurrency } from "@biz11/store/business/selectors";
import { getDefaultSku } from "@biz11/Types/Api";
import { ProductCard } from "@biz11/components/ui/ProductCard";
import { AddToCartSection } from "@biz11/components/layout/AddToCartSection";
import { ProductDetailSkeleton } from "@biz11/components/Skeletons/ProductDetailSkeleton";

function formatPrice(price: string, currency: string): string {
  const symbols: Record<string, string> = { USD: "$", EUR: "\u20AC", GBP: "\u00A3", NPR: "\u20A8" };
  return `${symbols[currency] || "$"}${price}`;
}

export function ProductDetail({ slug }: { slug: string }) {
  const { data: productData, isLoading } = useProduct(slug);
  const product = productData?.data ?? null;
  const { data: related } = useRelatedProducts(product);
  const currency = useStore(selectCurrency);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-muted">Product not found</p>
      </div>
    );
  }

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
        <span className="font-semibold text-primary">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-border-light shadow-lg">
            <img
              src={product.coverUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </div>
          {product.skus?.[0]?.gallery && product.skus[0].gallery.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.skus[0].gallery.map((url, i) => (
                <div key={i} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
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
                  key={cat.nanoId ?? cat.slug}
                  className="rounded-full bg-border-light px-3.5 py-1 text-xs font-medium text-muted"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </div>

          <p className="text-4xl font-black text-primary">
            {formatPrice(getDefaultSku(product).price, currency)}
          </p>

          <p className="leading-relaxed text-muted">{product.description}</p>

          <AddToCartSection
            nanoId={product.nanoId ?? ""}
            name={product.name}
            price={getDefaultSku(product).price}
            coverUrl={product.coverUrl}
            skuCode={getDefaultSku(product).skuCode}
            quantity={getDefaultSku(product).quantity}
          />

          {product.skus?.[0]?.variantAttributes && (
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold tracking-wide text-primary">
                Variant Details
              </h3>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                {Object.entries(product.skus[0].variantAttributes).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                      {key}
                    </dt>
                    <dd className="mt-0.5 text-sm font-medium text-foreground">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

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
