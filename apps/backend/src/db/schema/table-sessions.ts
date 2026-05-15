import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { restaurants } from './restaurants';
import { restaurantTables } from './restaurant-tables';
import { users } from './users';

export const tableSessions = pgTable('table_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  tableId: uuid('table_id')
    .notNull()
    .references(() => restaurantTables.id, { onDelete: 'cascade' }),
  customerId: uuid('customer_id').references(() => users.id, { onDelete: 'set null' }),
  sessionToken: varchar('session_token', { length: 255 }).notNull().unique(),
  startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
  endedAt: timestamp('ended_at', { withTimezone: true }),
});
