import { pgTable, uuid, varchar, timestamp, jsonb, boolean, integer } from 'drizzle-orm/pg-core';

export const advertisements = pgTable('advertisements', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  mediaType: varchar('media_type', { length: 10 }).default('image').notNull(),
  content: varchar('content', { length: 2000 }),
  imageUrl: varchar('image_url', { length: 500 }),
  duration: integer('duration').default(15).notNull(),
  assignedGames: jsonb('assigned_games').default('[]').notNull(),
  targetRestaurants: jsonb('target_restaurants').default('[]').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  startDate: timestamp('start_date', { withTimezone: true }),
  endDate: timestamp('end_date', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
