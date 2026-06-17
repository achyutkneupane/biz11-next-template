export interface BusinessResource {
  nanoId: string;
  name: string;
  currency: string;
  timezone: string;
}

export interface BrandResource {
  nanoId: string | null;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string;
  productsCount: number;
  createdAt: string | null;
}

export interface CategoryResource {
  nanoId: string | null;
  name: string;
  slug: string;
  description: string | null;
  depth: number;
  parentId: number | null;
  coverUrl: string;
  productsCount: number;
  children: CategoryResource[];
  createdAt: string | null;
}

export interface DefaultSku {
  nanoId: string | null;
  skuCode: string;
  price: string;
  quantity: number;
}

export interface ProductResource {
  nanoId: string | null;
  name: string;
  slug: string;
  description: string | null;
  specifications: unknown[] | null;
  coverUrl: string;
  brand: BrandResource;
  categories: CategoryResource[];
  defaultSku?: DefaultSku;
  skus?: SkuResource[];
  createdAt: string | null;
}

export function getDefaultSku(product: ProductResource): DefaultSku {
  if (product.skus && product.skus.length > 0) {
    const s = product.skus[0];
    return { nanoId: s.nanoId, skuCode: s.skuCode, price: s.price, quantity: s.quantity };
  }
  if (product.defaultSku) return product.defaultSku;
  return { nanoId: null, skuCode: "", price: "0", quantity: 0 };
}

export interface SkuResource {
  nanoId: string | null;
  skuCode: string;
  barcode: string | null;
  price: string;
  quantity: number;
  variantAttributes: Record<string, string> | null;
  coverUrl: string;
  gallery: string[];
  createdAt: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}
