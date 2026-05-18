import { pgTable, uuid, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { restaurants } from './restaurants';
import { users } from './users';
import { userRoleEnum } from './enums';

export const userRestaurants = pgTable('user_restaurants', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  role: userRoleEnum('role').notNull(),
  permissions: jsonb('permissions').default('{}').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
