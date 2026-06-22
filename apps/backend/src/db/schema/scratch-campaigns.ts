import { pgTable, uuid, varchar, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { restaurants } from './restaurants';
import { users } from './users';

export const scratchCampaigns = pgTable('scratch_campaigns', {
  id: uuid('id').defaultRandom().primaryKey(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  trigger: varchar('trigger', { length: 20 }).notNull(),
  behavior: varchar('behavior', { length: 20 }).default('scratch_card').notNull(),
  isEnabled: boolean('is_enabled').default(true).notNull(),
  voucherCode: varchar('voucher_code', { length: 50 }),
  title: varchar('title', { length: 100 }),
  config: jsonb('config'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const customerScratchRewards = pgTable('customer_scratch_rewards', {
  id: uuid('id').defaultRandom().primaryKey(),
  restaurantId: uuid('restaurant_id').notNull(),
  customerId: uuid('customer_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  trigger: varchar('trigger', { length: 20 }).notNull(),
  voucherCode: varchar('voucher_code', { length: 50 }).notNull(),
  claimedAt: timestamp('claimed_at', { withTimezone: true }).defaultNow().notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }),
  expiryAt: timestamp('expiry_at', { withTimezone: true }),
  isUsed: boolean('is_used').default(false).notNull(),
});
