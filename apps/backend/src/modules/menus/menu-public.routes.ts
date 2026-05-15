import { Router } from 'express';
import { eq, and } from 'drizzle-orm';
import { db } from '../../db';
import { menuCategories, menuItems } from '../../db/schema';

type CategoryRow = typeof menuCategories.$inferSelect;
type ItemRow = typeof menuItems.$inferSelect;

const router = Router();

// GET /api/v1/menus — public menu for current tenant
router.get('/', async (req, res, next) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant context required' });
    }

    const categories = await db
      .select()
      .from(menuCategories)
      .where(
        and(
          eq(menuCategories.restaurantId, req.tenant.id),
          eq(menuCategories.status, 'active')
        )
      )
      .orderBy(menuCategories.sortOrder);

    const items = await db
      .select()
      .from(menuItems)
      .where(
        and(
          eq(menuItems.restaurantId, req.tenant.id),
          eq(menuItems.isAvailable, true)
        )
      )
      .orderBy(menuItems.sortOrder);

    const menuData = categories.map((category: CategoryRow) => ({
      ...category,
      items: items.filter((item: ItemRow) => item.categoryId === category.id),
    }));

    res.json({ categories: menuData });
  } catch (error) {
    next(error);
  }
});

export default router;
