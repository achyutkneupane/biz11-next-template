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
  nanoId: string;
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
  defaultSku: DefaultSku;
  createdAt: string | null;
}

export interface SkuResource {
  nanoId: string | null;
  skuCode: string;
  barcode: string | null;
  price: string;
  quantity: number;
  variantAttributes: unknown[] | null;
  coverUrl: string;
  gallery: string[];
  createdAt: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}
