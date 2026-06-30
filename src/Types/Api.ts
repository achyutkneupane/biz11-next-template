export interface BusinessResource {
  nanoId: string;
  name: string;
  currency: string;
  timezone: string;
  visitorId: string;
  visitorSignature: string;
  stripePublishableKey?: string;
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

export type Specifications = Record<string, string>;

export interface ProductResource {
  nanoId: string | null;
  name: string;
  slug: string;
  description: string | null;
  specifications: Specifications;
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
  variantAttributes: Specifications;
  coverUrl: string;
  gallery: string[];
  createdAt: string | null;
}

export interface CartItemResource {
  id: number;
  skuId: number;
  productName: string;
  skuCode: string;
  coverUrl: string | null;
  unitPrice: string;
  quantity: number;
  subtotal: string;
}

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

export interface OrderResource {
  orderNumber: number;
  nanoId: string;
  status: OrderStatus;
  paymentStatus: string;
  channel: string;
  currency: string;
  summary: {
    subtotal: string;
    tax: string;
    discount: string;
    total: string;
  };
  paidAt: string | null;
  notes: string | null;
  timeline?: Array<{ label: string; timestamp: string; status: string }>;
  customer?: { name: string; email: string } | null;
  items: OrderItem[];
  transactions?: Array<{
    provider: string;
    paymentId: string;
    amount: string;
    currency: string;
    status: string;
    date: string;
  }>;
  createdAt: string;
  /** @deprecated Use summary.subtotal */
  subtotal?: string;
  /** @deprecated Use summary.tax */
  tax?: string;
  /** @deprecated Use summary.discount */
  discount?: string;
  /** @deprecated Use summary.total */
  total?: string;
}

export interface OrderItem {
  productName: string;
  skuCode: string;
  coverUrl: string | null;
  unitPrice: string;
  quantity: number;
  subtotal: string;
}

export interface AddressResource {
  id: number;
  label: string | null;
  name: string;
  phone: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postalCode: string | null;
  country: string;
  isDefault: boolean;
}

export type AddressInput = {
  name: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

export interface CheckoutInput {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes?: string;
  billing_address_id?: number;
  shipping_address_id?: number;
  create_account?: boolean;
}

export interface CheckoutResponse {
  order: OrderResource;
  paymentIntent: unknown;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface UserResource {
  id: number;
  name: string;
  email: string;
  role: string;
}
