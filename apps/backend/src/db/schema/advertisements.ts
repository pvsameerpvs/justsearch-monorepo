import { pgTable, uuid, varchar, timestamp, jsonb, boolean, integer, decimal } from 'drizzle-orm/pg-core';

export const advertisements = pgTable('advertisements', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),          // 'platform' | 'restaurant_brought'
  mediaType: varchar('media_type', { length: 10 }).default('image').notNull(),  // 'image' | 'video' | 'gif'
  content: varchar('content', { length: 2000 }),
  imageUrl: varchar('image_url', { length: 500 }),
  linkUrl: varchar('link_url', { length: 1000 }),
  mediaUrlLow: varchar('media_url_low', { length: 500 }),
  duration: integer('duration').default(15).notNull(),
  category: varchar('category', { length: 50 }),
  budget: decimal('budget', { precision: 10, scale: 2 }).default('0'),
  costPerImpression: decimal('cost_per_impression', { precision: 10, scale: 2 }).default('0'),
  impressions: integer('impressions').default(0),
  spent: decimal('spent', { precision: 10, scale: 2 }).default('0'),
  assignedGames: jsonb('assigned_games').default('[]').notNull(),
  targetRestaurants: jsonb('target_restaurants').default('[]').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  startDate: timestamp('start_date', { withTimezone: true }),
  endDate: timestamp('end_date', { withTimezone: true }),
  visibility: jsonb('visibility').default({ title: true, description: false, linkUrl: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
