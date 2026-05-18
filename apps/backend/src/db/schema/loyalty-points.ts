import { pgTable, uuid, timestamp, integer, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './users';

export const loyaltyPoints = pgTable('loyalty_points', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  points: integer('points').default(0).notNull(),
  totalEarned: integer('total_earned').default(0).notNull(),
  totalRedeemed: integer('total_redeemed').default(0).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userUniqueIdx: uniqueIndex('loyalty_points_user_id_idx').on(table.userId),
}));
