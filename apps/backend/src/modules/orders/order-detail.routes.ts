import { Router } from 'express';
import { eq, and, sql } from 'drizzle-orm';
import { db } from '../../db';
import { orders, orderItems, restaurants } from '../../db/schema';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

// GET /api/v1/orders/:id — get order details (cross-schema for customers)
router.get('/:id', async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const customerId = req.auth?.id;
    const isCustomer = req.auth?.type === 'customer';

    // For customers: search across all schemas to support cross-restaurant order history
    if (isCustomer && customerId) {
      const schemas = await db
        .select({ schemaName: restaurants.schemaName })
        .from(restaurants)
        .where(eq(restaurants.status, 'active'));

      for (const { schemaName } of schemas) {
        const orderRows = await db.execute<Record<string, unknown>>(
          sql`SELECT * FROM ${sql.identifier(schemaName)}."orders" WHERE id = ${orderId} AND customer_id = ${customerId} LIMIT 1`
        );

        if (orderRows.length > 0) {
          const items = await db.execute<Record<string, unknown>>(
            sql`SELECT * FROM ${sql.identifier(schemaName)}."order_items" WHERE order_id = ${orderId}`
          );
          return res.json({ order: orderRows[0], items });
        }
      }
      return res.status(404).json({ error: 'Order not found' });
    }

    // For staff/delivery: tenant-scoped (existing behavior)
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const [order] = await db.select().from(orders).where(
      and(eq(orders.id, orderId), eq(orders.restaurantId, req.tenant.id))
    ).limit(1);

    if (!order) return res.status(404).json({ error: 'Order not found' });

    const items = await db.select().from(orderItems).where(
      and(eq(orderItems.orderId, orderId), eq(orderItems.restaurantId, req.tenant.id))
    );
    return res.json({ order, items });
  } catch (error) {
    next(error);
  }
});

export default router;
