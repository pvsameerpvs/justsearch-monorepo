import { pgTable, uuid, varchar, timestamp, boolean, decimal, integer, text } from 'drizzle-orm/pg-core';
import { restaurants } from './restaurants';
import { users } from './users';
import {
  orderStatusEnum,
  paymentStatusEnum,
  fulfillmentTypeEnum,
  orderSourceEnum,
} from './enums';

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  code: varchar('code', { length: 20 }).notNull().unique(),
  customerId: uuid('customer_id').references(() => users.id, { onDelete: 'set null' }),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 20 }).notNull(),
  status: orderStatusEnum('status').default('pending').notNull(),
  paymentStatus: paymentStatusEnum('payment_status').default('unpaid').notNull(),
  fulfillmentType: fulfillmentTypeEnum('fulfillment_type').notNull(),
  source: orderSourceEnum('source').default('direct_web').notNull(),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  deliveryFee: decimal('delivery_fee', { precision: 10, scale: 2 }).default('0').notNull(),
  tax: decimal('tax', { precision: 10, scale: 2 }).default('0').notNull(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  deliveryAddress: text('delivery_address'),
  lat: decimal('lat', { precision: 10, scale: 8 }),
  lng: decimal('lng', { precision: 10, scale: 8 }),
  notes: text('notes'),
  driverId: uuid('driver_id'),
  etaMinutes: integer('eta_minutes'),
  tableId: uuid('table_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
