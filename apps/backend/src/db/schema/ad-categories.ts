import { pgTable, uuid, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';

export const adCategories = pgTable('ad_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
