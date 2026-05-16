import { Router } from 'express';
import { sql, eq } from 'drizzle-orm';
import { db } from '../../db';
import { restaurants } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/', requireRole('super_admin'), async (_req, res, next) => {
  try {
    const schemas = await db
      .select({ schemaName: restaurants.schemaName, id: restaurants.id, name: restaurants.name })
      .from(restaurants)
      .where(eq(restaurants.status, 'active'));

    const allUsers: Array<Record<string, unknown>> = [];
    for (const schema of schemas) {
      const rows = await db.execute(
        sql`SELECT id, email, phone, name, role, is_active, created_at 
            FROM ${sql.identifier(schema.schemaName)}.users 
            ORDER BY created_at DESC 
            LIMIT 500`
      );
      for (const row of rows) {
        allUsers.push({
          ...(row as Record<string, unknown>),
          restaurantId: schema.id,
          restaurantName: schema.name,
        });
      }
    }

    res.json({ users: allUsers });
  } catch (error) {
    next(error);
  }
});

router.get('/:restaurantId', requireRole('super_admin'), async (req, res, next) => {
  try {
    const [restaurant] = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.id, req.params.restaurantId))
      .limit(1);

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const rows = await db.execute(
      sql`SELECT id, email, phone, name, role, is_active, created_at 
          FROM ${sql.identifier(restaurant.schemaName)}.users 
          ORDER BY created_at DESC`
    );

    res.json({ users: rows, restaurant: { id: restaurant.id, name: restaurant.name } });
  } catch (error) {
    next(error);
  }
});

export default router;
