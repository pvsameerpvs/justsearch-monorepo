/**
 * JustSearch — Common Shared Types
 * Single source of truth for all apps.
 */

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled';

export type PaymentMode = 'cash' | 'card';
export type PaymentStatus = 'unpaid' | 'paid';
export type UserRole = 'customer' | 'owner' | 'manager' | 'cashier' | 'kitchen_staff' | 'driver' | 'super_admin';
export type FulfillmentType = 'dine_in' | 'delivery' | 'pickup';

export interface Order {
  id: string;
  code: string;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  paymentMode: PaymentMode | null;
  paymentStatus: PaymentStatus;
  driverId: string | null;
  restaurantId: string;
  restaurantName?: string;
  deliveryAddress: string | null;
  notes: string | null;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  currency: string;
}

export interface DailyCloseout {
  id: string;
  restaurantId: string;
  date: string;
  cashTotal: number;
  cardTotal: number;
  orderCount: number;
  grandTotal: number;
  closedBy: string;
  closedAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  restaurantId?: string;
  type: 'customer' | 'staff' | 'delivery' | 'super_admin';
}

export interface Tenant {
  id: string;
  slug: string;
  subdomain: string;
  name: string;
  status: 'active' | 'inactive' | 'suspended' | 'draft';
  schemaName: string;
}

export { ORDER_STATUS_LABELS, ORDER_STATUS_STAGE, PAYMENT_MODE_LABELS } from './constants';

