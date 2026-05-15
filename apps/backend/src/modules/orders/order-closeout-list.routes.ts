import { Router } from 'express';
import { db } from '../../db';
import { dailyCloseouts } from '../../db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { requireRole } from '../../middleware/auth.middleware';

const router = Router();

// GET /api/v1/close-day — list closeouts
router.get('/', requireRole('owner', 'manager', 'cashier'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const date = req.query.date as string | undefined;
    let query = db.select().from(dailyCloseouts).where(eq(dailyCloseouts.restaurantId, req.tenant.id));

    if (date) {
      query = db
        .select()
        .from(dailyCloseouts)
        .where(and(eq(dailyCloseouts.restaurantId, req.tenant.id), eq(dailyCloseouts.date, date)));
    }

    const list = await query.orderBy(sql`${dailyCloseouts.date} desc`).limit(30);
    res.json({ closeouts: list });
  } catch (error) {
    next(error);
  }
});

export default router;
