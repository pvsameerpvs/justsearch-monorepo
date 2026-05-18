import { pgTable, uuid, varchar, timestamp, integer, boolean, decimal } from 'drizzle-orm/pg-core';
import { restaurants } from './restaurants';
import { deliveryAgentStatusEnum, vehicleTypeEnum } from './enums';

export const deliveryAgents = pgTable('delivery_agents', {
  id: uuid('id').defaultRandom().primaryKey(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  username: varchar('username', { length: 100 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  vehicleType: vehicleTypeEnum('vehicle_type').default('scooter').notNull(),
  status: deliveryAgentStatusEnum('status').default('offline').notNull(),
  rating: decimal('rating', { precision: 2, scale: 1 }).default('5.0').notNull(),
  completedToday: integer('completed_today').default(0).notNull(),
  shiftLabel: varchar('shift_label', { length: 100 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
