import { pgTable, uuid, varchar, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';
import { restaurantStatusEnum } from './enums';

export const restaurants = pgTable('restaurants', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 64 }).notNull().unique(),
  subdomain: varchar('subdomain', { length: 64 }).notNull().unique(),
  schemaName: varchar('schema_name', { length: 64 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  status: restaurantStatusEnum('status').default('draft').notNull(),
  settings: jsonb('settings').default('{}').notNull(),
  theme: jsonb('theme').default('{}').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
