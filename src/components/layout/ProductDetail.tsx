"use client";

import {useState} from "react";
import {notFound} from "next/navigation";
import {useProduct, useRelatedProducts} from "@biz11/Hooks/products/useProducts";
import {useStore} from "@biz11/store";
import {selectCurrency} from "@biz11/store/business/selectors";
import {formatPrice} from "@biz11/lib/helpers";
import {ApiError} from "@biz11/lib/api-client";
import {Breadcrumbs} from "@biz11/components/ui/Breadcrumbs";
import {SpecificationsTable} from "@biz11/components/ui/SpecificationsTable";
import {ProductCard} from "@biz11/components/ui/ProductCard";
import {ProductImageGallery} from "@biz11/components/layout/ProductImageGallery";
import {SkuSelector} from "@biz11/components/layout/SkuSelector";
import {AddToCartSection} from "@biz11/components/layout/AddToCartSection";
import {ProductDetailSkeleton} from "@biz11/components/Skeletons/ProductDetailSkeleton";
import {Specifications} from "@biz11/Types/Api";

const buildSpecs = (specifications: Specifications | null) => {
	if (!specifications) return null;
	const entries = Object.entries(specifications);
	return entries.length > 0 ? entries.map(([k, v]) => ({key: k, value: v})) : null;
}

export function ProductDetail({slug}: { slug: string }) {
	const {data: productData, isLoading, isPending, isError, error} = useProduct(slug);
	const product = productData?.data ?? null;
	const {data: related} = useRelatedProducts(product);
	const currency = useStore(selectCurrency);

	const skus = product?.skus ?? [];
	const [selectedSkuIndex, setSelectedSkuIndex] = useState(0);
	// eslint-disable-next-line security/detect-object-injection
	const activeSku = skus[selectedSkuIndex];

	if (isPending || isLoading) return <ProductDetailSkeleton/>;

	if (isError) {
		if (error instanceof ApiError && error.status === 404) {
			notFound();
		}
		return (
			<div className="flex flex-col items-center justify-center py-24 text-center">
				<div className="mb-5 rounded-2xl border border-border bg-surface p-6 shadow-sm">
					<span className="text-5xl">!</span>
				</div>
				<h2 className="text-xl font-bold text-primary">Something went wrong</h2>
				<p className="mt-1 text-sm text-muted">
					{error instanceof ApiError ? error.detail : "Failed to load product. Please try again."}
				</p>
			</div>
		);
	}

	if (!product) {
		notFound();
	}

	const productSpecs = buildSpecs(product.specifications);
	const skuSpecs = buildSpecs(activeSku.variantAttributes);

	return (
		<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
			<Breadcrumbs
				items={[
					{label: "Home", href: "/"},
					{label: "Products", href: "/products"},
					{label: product.name},
				]}
			/>

			<div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
				<ProductImageGallery sku={activeSku} productName={product.name} productCoverUrl={product.coverUrl}/>

				<div className="flex flex-col gap-6">
					<div>
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
              {product.brand.name}
            </span>
						<h1 className="mt-1 text-3xl font-black text-primary sm:text-4xl">{product.name}</h1>
						<div className="mt-3 flex flex-wrap gap-2">
							{product.categories.map((cat) => (
								<span key={cat.nanoId ?? cat.slug}
								      className="rounded-full bg-border-light px-3.5 py-1 text-xs font-medium text-muted">
                  {cat.name}
                </span>
							))}
						</div>
					</div>

					<div className="flex items-end gap-3">
						{activeSku?.discountPrice ? (
							<>
								<p className="text-3xl font-black text-accent">
									{formatPrice(activeSku.discountPrice, currency)}
								</p>
								<p className="mb-1 text-lg font-bold text-muted line-through">
									{formatPrice(activeSku.price, currency)}
								</p>
							</>
						) : (
							<p className="text-3xl font-black text-primary">
								{activeSku ? formatPrice(activeSku.price, currency) : ""}
							</p>
						)}
					</div>

					<p className="leading-relaxed text-muted">{product.description}</p>

					<SkuSelector
						skus={skus}
						selectedIndex={selectedSkuIndex}
						currency={currency}
						onChange={setSelectedSkuIndex}
					/>

					<AddToCartSection
						skuNanoId={activeSku?.nanoId ?? ""}
						name={product.name}
						price={activeSku?.price ?? "0"}
						coverUrl={product.coverUrl}
						skuCode={activeSku?.skuCode ?? ""}
						quantity={activeSku?.quantity ?? 0}
					/>

					{productSpecs && <SpecificationsTable items={productSpecs} />}
					{skuSpecs && <SpecificationsTable items={skuSpecs} title="SKU Variants" />}
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
							<ProductCard key={p.nanoId} product={p}/>
						))}
					</div>
				</section>
			)}
		</div>
	);
}
