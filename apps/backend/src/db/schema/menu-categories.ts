import { pgTable, uuid, varchar, timestamp, integer } from 'drizzle-orm/pg-core';
import { restaurants } from './restaurants';
import { menuStatusEnum } from './enums';

export const menuCategories = pgTable('menu_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 500 }),
  emoji: varchar('emoji', { length: 10 }),
  sortOrder: integer('sort_order').default(0).notNull(),
  status: menuStatusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
