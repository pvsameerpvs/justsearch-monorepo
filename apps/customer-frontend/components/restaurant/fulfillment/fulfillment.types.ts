import type { OrderStatus } from '@justsearch/types';

export type FulfillmentMode = 'dine-in' | 'delivery';
export type DeliveryOrderStatus = OrderStatus | 'order_confirmed' | 'assigned_delivery_boy' | 'delivered';

export type StoredCartItem = {
  itemId: string;
  quantity: number;
  name: string;
  price: number;
  currency: string;
  image?: string;
};

export type StoredOrder = {
  id: string;
  createdAt: number;
  items: StoredCartItem[];
  address: string;
  note: string;
  riderName: string;
  riderPhone?: string;
  subtotal: number;
  deliveryFee: number;
  deliverySavings?: number;
  promoCode?: string;
  promoDiscount?: number;
  total: number;
  cancelReason?: string;
};

export type StoredState = {
  mode: FulfillmentMode;
  cart: StoredCartItem[];
  orders: StoredOrder[];
};

export type DeliveryCartLine = StoredCartItem & {
  lineTotal: number;
};

export type DeliveryOrder = StoredOrder & {
  status: DeliveryOrderStatus;
};

export type FulfillmentContextType = {
  hydrated: boolean;
  mode: FulfillmentMode;
  setMode: (mode: FulfillmentMode) => void;
  cart: DeliveryCartLine[];
  cartCount: number;
  subtotal: number;
  deliveryFee: number;
  deliverySavings: number;
  total: number;
  orders: DeliveryOrder[];
  getQuantity: (itemId: string) => number;
  addToCart: (item: { id: string; name: string; price: number; currency: string; image?: string }) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (data: {
    address: string;
    note: string;
    promoCode?: string;
    promoDiscount?: number;
    paymentMethod?: 'cash' | 'card';
  }) => Promise<string | null>;
};
