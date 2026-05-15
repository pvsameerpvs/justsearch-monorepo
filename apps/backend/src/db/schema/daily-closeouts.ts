import { pgTable, uuid, date, decimal, integer, timestamp } from 'drizzle-orm/pg-core';
import { restaurants } from './restaurants';

export const dailyCloseouts = pgTable('daily_closeouts', {
  id: uuid('id').defaultRandom().primaryKey(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  date: date('date').notNull(),
  cashTotal: decimal('cash_total', { precision: 10, scale: 2 }).default('0').notNull(),
  cardTotal: decimal('card_total', { precision: 10, scale: 2 }).default('0').notNull(),
  orderCount: integer('order_count').default(0).notNull(),
  grandTotal: decimal('grand_total', { precision: 10, scale: 2 }).default('0').notNull(),
  closedBy: uuid('closed_by').notNull(),
  closedAt: timestamp('closed_at', { withTimezone: true }).defaultNow().notNull(),
});
