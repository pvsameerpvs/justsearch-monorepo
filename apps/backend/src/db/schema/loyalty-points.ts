import { pgTable, uuid, timestamp, integer } from 'drizzle-orm/pg-core';
import { restaurants } from './restaurants';
import { users } from './users';

export const loyaltyPoints = pgTable('loyalty_points', {
  id: uuid('id').defaultRandom().primaryKey(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  customerId: uuid('customer_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  points: integer('points').default(0).notNull(),
  totalEarned: integer('total_earned').default(0).notNull(),
  totalRedeemed: integer('total_redeemed').default(0).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
