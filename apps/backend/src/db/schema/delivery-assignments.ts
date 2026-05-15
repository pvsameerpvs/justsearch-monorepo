import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';
import { restaurants } from './restaurants';
import { orders } from './orders';
import { deliveryAgents } from './delivery-agents';
import { deliveryAssignmentStatusEnum } from './enums';

export const deliveryAssignments = pgTable('delivery_assignments', {
  id: uuid('id').defaultRandom().primaryKey(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  agentId: uuid('agent_id')
    .notNull()
    .references(() => deliveryAgents.id, { onDelete: 'cascade' }),
  assignedAt: timestamp('assigned_at', { withTimezone: true }).defaultNow().notNull(),
  pickedUpAt: timestamp('picked_up_at', { withTimezone: true }),
  deliveredAt: timestamp('delivered_at', { withTimezone: true }),
  status: deliveryAssignmentStatusEnum('status').default('assigned').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
