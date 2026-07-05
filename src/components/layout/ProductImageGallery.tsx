"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import type { SkuResource } from "@biz11/Types/Api";

function getSkuImages(sku: SkuResource): string[] {
  return [sku.coverUrl, ...(sku.gallery ?? [])];
}

export function ProductImageGallery({
  sku,
  productName,
  productCoverUrl,
}: {
  sku: SkuResource | null;
  productName: string;
  productCoverUrl: string;
}) {
  const allImages = useMemo(() => {
    if (!sku) return [];
    return getSkuImages(sku);
  }, [sku]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  // eslint-disable-next-line security/detect-object-injection
  const selectedImage = allImages[selectedIndex] || productCoverUrl;

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-border-light shadow-lg">
        <Image src={selectedImage} alt={productName} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      </div>
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {allImages.map((url, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={clsx(
                "h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors duration-200 cursor-pointer",
                i === selectedIndex
                  ? "border-accent ring-1 ring-accent"
                  : "border-border hover:border-muted-light",
              )}
            >
              <Image src={url} alt="" width={80} height={80} className="h-20 w-20 object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
