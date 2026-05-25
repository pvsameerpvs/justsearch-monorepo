import { Router } from 'express';
import { eq, and, sql } from 'drizzle-orm';
import { db } from '../../db';
import { orders, orderItems, restaurants } from '../../db/schema';
import { authMiddleware } from '../../middleware/auth.middleware';
import { normalizeRawOrder, normalizeRawItem, extractLogoUrl } from './order-normalizer';

const router = Router();
router.use(authMiddleware);

// GET /api/v1/orders/:id — get order details (cross-schema for customers)
router.get('/:id', async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const customerId = req.auth?.id;
    const isCustomer = req.auth?.type === 'customer';

    if (isCustomer && customerId) {
      const schemas = await db
        .select({
          schemaName: restaurants.schemaName,
          name: restaurants.name,
          slug: restaurants.slug,
          subdomain: restaurants.subdomain,
          settings: restaurants.settings,
        })
        .from(restaurants)
        .where(eq(restaurants.status, 'active'));

      for (const schema of schemas) {
        const orderRows = await db.execute<Record<string, unknown>>(
          sql`SELECT * FROM ${sql.identifier(schema.schemaName)}."orders" WHERE id = ${orderId} AND customer_id = ${customerId} LIMIT 1`
        );

        if (orderRows.length > 0) {
          const items = await db.execute<Record<string, unknown>>(
            sql`SELECT * FROM ${sql.identifier(schema.schemaName)}."order_items" WHERE order_id = ${orderId}`
          );

          const normalized = normalizeRawOrder(orderRows[0]);
          normalized.restaurantName = schema.name;
          normalized.restaurantSlug = schema.slug;
          normalized.restaurantSubdomain = schema.subdomain;
          normalized.restaurantLogoUrl = extractLogoUrl(schema.settings);

          return res.json({
            order: normalized,
            items: items.map(normalizeRawItem),
          });
        }
      }
      return res.status(404).json({ error: 'Order not found' });
    }

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
