import { pgTable, varchar, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';

export const games = pgTable('games', {
  id: varchar('id', { length: 100 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  config: jsonb('config').default('{}').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdBy: varchar('created_by', { length: 100 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
