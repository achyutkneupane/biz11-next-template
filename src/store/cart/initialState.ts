export type CartItem = {
  nanoId: string;
  name: string;
  price: string;
  quantity: number;
  coverUrl: string;
  skuCode: string;
};

export type CartState = {
  items: CartItem[];
};

export const initialCartState: CartState = {
  items: [],
};
