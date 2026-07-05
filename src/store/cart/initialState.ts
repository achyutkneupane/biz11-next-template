export type CartItem = {
  id: number;
  skuId: number;
  productName: string;
  skuCode: string;
  coverUrl: string | null;
  unitPrice: string;
  quantity: number;
  subtotal: string;
};

export type CartState = {
  items: CartItem[];
};

export const initialCartState: CartState = {
  items: [],
};
