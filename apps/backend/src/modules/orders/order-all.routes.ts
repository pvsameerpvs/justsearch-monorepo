import { Router } from 'express';
import { eq, sql } from 'drizzle-orm';
import { db } from '../../db';
import { restaurants } from '../../db/schema';
import { authMiddleware } from '../../middleware/auth.middleware';
import { extractLogoUrl } from './order-normalizer';

const router = Router();
router.use(authMiddleware);

// GET /api/v1/orders/my-all — list ALL orders across ALL restaurants for the authenticated customer
router.get('/', async (req, res, next) => {
  try {
    if (!req.auth?.id) return res.status(401).json({ error: 'Authentication required' });

    const customerId = req.auth.id;

    const schemas = await db
      .select({
        schemaName: restaurants.schemaName,
        id: restaurants.id,
        name: restaurants.name,
        slug: restaurants.slug,
        subdomain: restaurants.subdomain,
        settings: restaurants.settings,
      })
      .from(restaurants)
      .where(eq(restaurants.status, 'active'));

    const allOrders = [];

    for (const schema of schemas) {
      const rows = await db.execute<Record<string, unknown>>(
        sql`SELECT id, code, status, total, created_at, fulfillment_type
        FROM ${sql.identifier(schema.schemaName)}."orders"
        WHERE customer_id = ${customerId}
        ORDER BY created_at DESC
        LIMIT 50`
      );

      const logoUrl = extractLogoUrl(schema.settings);

      for (const row of rows) {
        allOrders.push({
          id: row.id as string,
          code: row.code as string,
          restaurantId: schema.id,
          restaurantName: schema.name,
          restaurantSlug: schema.slug,
          restaurantSubdomain: schema.subdomain,
          restaurantLogoUrl: logoUrl || null,
          status: row.status as string,
          total: String(row.total),
          createdAt: new Date(row.created_at as string),
          fulfillmentType: row.fulfillment_type as string,
        });
      }
    }

    // Sort by date across all restaurants
    allOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    res.json({ orders: allOrders });
  } catch (error) {
    next(error);
  }
});

export default router;
