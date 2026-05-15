import { pgTable, uuid, varchar, timestamp, integer } from 'drizzle-orm/pg-core';
import { restaurants } from './restaurants';
import { menuStatusEnum } from './enums';

export const menus = pgTable('menus', {
  id: uuid('id').defaultRandom().primaryKey(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 500 }),
  status: menuStatusEnum('status').default('active').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
