"use client";

import { useState, useMemo } from "react";
import { clsx } from "clsx";
import Link from "next/link";
import { useBusiness } from "@biz11/Hooks/useBusiness";
import { useProduct, useRelatedProducts } from "@biz11/Hooks/products/useProducts";
import { useStore } from "@biz11/store";
import { selectCurrency } from "@biz11/store/business/selectors";
import { ProductCard } from "@biz11/components/ui/ProductCard";
import { AddToCartSection } from "@biz11/components/layout/AddToCartSection";
import { ProductDetailSkeleton } from "@biz11/components/Skeletons/ProductDetailSkeleton";
import type { SkuResource } from "@biz11/Types/Api";

function formatPrice(price: string, currency: string): string {
  const symbols: Record<string, string> = { USD: "$", EUR: "\u20AC", GBP: "\u00A3", NPR: "\u20A8" };
  return `${symbols[currency] || "$"}${price}`;
}

function getSkuImages(sku: SkuResource): string[] {
  return [sku.coverUrl, ...(sku.gallery ?? [])];
}

function SkuLabel({ sku }: { sku: SkuResource }) {
  if (sku.variantAttributes && Object.keys(sku.variantAttributes).length > 0) {
    return <>{Object.values(sku.variantAttributes).join(" / ")}</>;
  }
  return <>{sku.skuCode}</>;
}

export function ProductDetail({ slug }: { slug: string }) {
  const { data: productData, isLoading } = useProduct(slug);
  const product = productData?.data ?? null;
  const { data: related } = useRelatedProducts(product);
  const currency = useStore(selectCurrency);

  const skus = product?.skus ?? [];
  const [selectedSkuIndex, setSelectedSkuIndex] = useState(0);
  const activeSku = skus[selectedSkuIndex];

  const allImages = useMemo(() => {
    if (!activeSku) return [];
    return getSkuImages(activeSku);
  }, [activeSku]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const selectedImage = allImages[selectedImageIndex] ?? "";

  const handleSkuChange = (index: number) => {
    setSelectedSkuIndex(index);
    setSelectedImageIndex(0);
  };

  if (isLoading) return <ProductDetailSkeleton />;

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
        <Link href="/" className="font-medium text-muted transition-colors duration-200 hover:text-primary">
          Home
        </Link>
        <span className="mx-2 text-muted-light">/</span>
        <Link href="/products" className="font-medium text-muted transition-colors duration-200 hover:text-primary">
          Products
        </Link>
        <span className="mx-2 text-muted-light">/</span>
        <span className="font-semibold text-primary">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-border-light shadow-lg">
            <img
              src={selectedImage || product.coverUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={clsx(
                    "h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 cursor-pointer",
                    i === selectedImageIndex
                      ? "border-accent ring-1 ring-accent"
                      : "border-border hover:border-muted-light",
                  )}
                >
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </button>
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
                <span key={cat.nanoId ?? cat.slug} className="rounded-full bg-border-light px-3.5 py-1 text-xs font-medium text-muted">
                  {cat.name}
                </span>
              ))}
            </div>
          </div>

          <p className="text-3xl font-black text-primary">
            {activeSku ? formatPrice(activeSku.price, currency) : ""}
          </p>

          <p className="leading-relaxed text-muted">{product.description}</p>

          {skus.length > 1 && (
            <div>
              <p className="mb-3 text-sm font-semibold text-foreground">
                Options
              </p>
              <div className="flex flex-wrap gap-3">
                {skus.map((sku, i) => {
                  const inStock = sku.quantity > 0;
                  const selected = i === selectedSkuIndex;
                  return (
                    <button
                      key={sku.nanoId ?? sku.skuCode}
                      onClick={() => handleSkuChange(i)}
                      className={clsx(
                        "rounded-xl border-2 px-5 py-3 text-left text-sm transition-all duration-200 cursor-pointer",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
                        selected
                          ? "border-accent bg-accent/5 shadow-sm"
                          : "border-border bg-surface hover:border-muted-light hover:shadow-sm",
                        !inStock && "opacity-50",
                      )}
                    >
                      <span className="font-semibold text-foreground">
                        <SkuLabel sku={sku} />
                      </span>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-bold text-primary">
                          {formatPrice(sku.price, currency)}
                        </span>
                        {inStock ? (
                          <span className="flex items-center gap-1 text-xs text-success">
                            <span className="h-1.5 w-1.5 rounded-full bg-success" />
                            In Stock
                          </span>
                        ) : (
                          <span className="text-xs text-muted">Out of Stock</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <AddToCartSection
            nanoId={product.nanoId ?? ""}
            name={product.name}
            price={activeSku?.price ?? "0"}
            coverUrl={selectedImage || product.coverUrl}
            skuCode={activeSku?.skuCode ?? ""}
            quantity={activeSku?.quantity ?? 0}
          />

          {activeSku?.variantAttributes && Object.keys(activeSku.variantAttributes).length > 0 && (
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold tracking-wide text-primary">
                Variant Details
              </h3>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                {Object.entries(activeSku.variantAttributes).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{key}</dt>
                    <dd className="mt-0.5 text-sm font-medium text-foreground">{value}</dd>
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
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{spec.key}</dt>
                    <dd className="mt-0.5 text-sm font-medium text-foreground">{spec.value}</dd>
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
            <h2 className="mt-1 text-2xl font-black text-primary">Related Products</h2>
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
