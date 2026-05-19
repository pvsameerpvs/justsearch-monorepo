import { pgTable, uuid, varchar, decimal, boolean, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const adBillingEvents = pgTable('ad_billing_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  adId: uuid('ad_id').notNull(),
  restaurantId: uuid('restaurant_id'),
  customerId: uuid('customer_id'),
  eventType: varchar('event_type', { length: 20 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).default('0').notNull(),
  isConfirmed: boolean('is_confirmed').default(false),
  deviceFingerprint: varchar('device_fingerprint', { length: 255 }),
  metadata: jsonb('metadata').default('{}'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
