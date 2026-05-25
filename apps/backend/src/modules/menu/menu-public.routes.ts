import { Router } from 'express';
import { eq, and, sql } from 'drizzle-orm';
import { db } from '../../db';
import { authMiddleware } from '../../middleware/auth.middleware';
import { t, mapRows } from '../../lib/tenant-sql';

const router = Router();

// GET /api/v1/menus — public menu for current tenant
router.get('/', async (req, res, next) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant context required' });
    }

    const schemaName = req.tenant.schemaName;

    const categories = mapRows(await db.execute<Record<string, unknown>>(sql`
      SELECT * FROM ${t(schemaName, 'menu_categories')}
      WHERE restaurant_id = ${req.tenant.id} AND status = 'active'
      ORDER BY sort_order
    `));

    const items = mapRows(await db.execute<Record<string, unknown>>(sql`
      SELECT * FROM ${t(schemaName, 'menu_items')}
      WHERE restaurant_id = ${req.tenant.id} AND is_available = true
      ORDER BY sort_order
    `));

    const menuData = categories.map((category) => ({
      ...category,
      items: items.filter((item) => item.categoryId === category.id),
    }));

    res.json({ categories: menuData });
  } catch (error) {
    next(error);
  }
});

export default router;
