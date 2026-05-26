export interface DemoOrder {
  code: string;
  customerName: string;
  customerPhone: string;
  status: string;
  fulfillmentType: string;
  subtotal: string;
  deliveryFee: string;
  tax: string;
  total: string;
  createdAt: string;
  items: { name: string; quantity: number; price: string }[];
}

export { makeOrdersGroupA } from './demo-orders-group-a';
export { makeOrdersGroupB } from './demo-orders-group-b';
