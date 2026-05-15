import { pgTable, uuid, varchar, timestamp, integer } from 'drizzle-orm/pg-core';
import { restaurants } from './restaurants';

export const otpRequests = pgTable('otp_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  requestId: varchar('request_id', { length: 36 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  mobile: varchar('mobile', { length: 20 }).notNull(),
  otp: varchar('otp', { length: 10 }).notNull(),
  attempts: integer('attempts').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});
