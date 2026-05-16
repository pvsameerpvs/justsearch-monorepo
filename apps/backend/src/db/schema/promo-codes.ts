import { pgTable, uuid, varchar, timestamp, boolean, decimal, integer, text } from 'drizzle-orm/pg-core';
import { restaurants } from './restaurants';
import { promoCodeTypeEnum } from './enums';

export const promoCodes = pgTable('promo_codes', {
  id: uuid('id').defaultRandom().primaryKey(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  code: varchar('code', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }),
  description: text('description'),
  type: promoCodeTypeEnum('type').notNull(),
  value: decimal('value', { precision: 10, scale: 2 }).notNull(),
  minOrder: decimal('min_order', { precision: 10, scale: 2 }).default('0').notNull(),
  maxDiscount: decimal('max_discount', { precision: 10, scale: 2 }),
  usageLimit: integer('usage_limit').default(0).notNull(),
  usageCount: integer('usage_count').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  validFrom: timestamp('valid_from', { withTimezone: true }),
  validUntil: timestamp('valid_until', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
