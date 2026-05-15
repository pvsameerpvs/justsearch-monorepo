import { pgTable, uuid, varchar, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';
import { restaurants } from './restaurants';
import { users } from './users';

export const gameSessions = pgTable('game_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  gameId: varchar('game_id', { length: 100 }).notNull(),
  customerId: uuid('customer_id').references(() => users.id, { onDelete: 'set null' }),
  score: integer('score').notNull(),
  pointsAwarded: integer('points_awarded').default(0).notNull(),
  level: integer('level'),
  scoringVersion: varchar('scoring_version', { length: 20 }).notNull(),
  playedAt: timestamp('played_at', { withTimezone: true }).defaultNow().notNull(),
  metadata: jsonb('metadata').default('{}').notNull(),
});
