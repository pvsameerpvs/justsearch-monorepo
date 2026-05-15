import { pgEnum } from 'drizzle-orm/pg-core';

export const restaurantStatusEnum = pgEnum('restaurant_status', [
  'draft',
  'active',
  'inactive',
  'suspended',
]);

export const userRoleEnum = pgEnum('user_role', [
  'customer',
  'owner',
  'staff',
  'driver',
]);

export const staffRoleEnum = pgEnum('staff_role', [
  'owner',
  'manager',
  'cashier',
  'kitchen_staff',
]);

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'out_for_delivery',
  'completed',
  'cancelled',
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'unpaid',
  'pending',
  'paid',
  'failed',
  'refunded',
  'partially_refunded',
]);

export const fulfillmentTypeEnum = pgEnum('fulfillment_type', [
  'dine_in',
  'delivery',
  'pickup',
]);

export const orderSourceEnum = pgEnum('order_source', [
  'public_qr',
  'table_qr',
  'direct_web',
  'dashboard',
]);

export const tableStatusEnum = pgEnum('table_status', [
  'available',
  'occupied',
  'reserved',
  'cleaning',
]);

export const menuStatusEnum = pgEnum('menu_status', [
  'active',
  'inactive',
]);

export const deliveryAgentStatusEnum = pgEnum('delivery_agent_status', [
  'online',
  'busy',
  'offline',
]);

export const deliveryAssignmentStatusEnum = pgEnum('delivery_assignment_status', [
  'assigned',
  'picked_up',
  'in_transit',
  'delivered',
  'cancelled',
]);

export const paymentMethodEnum = pgEnum('payment_method', [
  'card',
  'cash',
  'wallet',
]);

export const vehicleTypeEnum = pgEnum('vehicle_type', [
  'bike',
  'scooter',
  'car',
]);

export const promoCodeTypeEnum = pgEnum('promo_code_type', [
  'fixed',
  'percentage',
]);
