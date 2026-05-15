import { pgTable, uuid, varchar, timestamp, decimal } from 'drizzle-orm/pg-core';
import { restaurants } from './restaurants';
import { orders } from './orders';
import { paymentStatusEnum, paymentMethodEnum } from './enums';

export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('AED').notNull(),
  status: paymentStatusEnum('status').default('pending').notNull(),
  method: paymentMethodEnum('method').notNull(),
  transactionRef: varchar('transaction_ref', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
