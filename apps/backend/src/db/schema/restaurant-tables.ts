import { pgTable, uuid, varchar, timestamp, integer, boolean } from 'drizzle-orm/pg-core';
import { restaurants } from './restaurants';
import { tableStatusEnum } from './enums';

export const restaurantTables = pgTable('restaurant_tables', {
  id: uuid('id').defaultRandom().primaryKey(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  tableNumber: varchar('table_number', { length: 20 }).notNull(),
  capacity: integer('capacity').default(4).notNull(),
  status: tableStatusEnum('status').default('available').notNull(),
  qrCodeUrl: varchar('qr_code_url', { length: 500 }),
  qrPayload: varchar('qr_payload', { length: 500 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
