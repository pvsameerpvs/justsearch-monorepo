import { Router } from 'express';
import { db } from '../../db';
import { orders } from '../../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

// GET /api/v1/orders — list orders (with optional driverId filter)
router.get('/', requireRole('owner', 'manager', 'cashier', 'kitchen_staff'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const driverId = req.query.driverId as string | undefined;
    let query;

    if (driverId) {
      query = db.select().from(orders).where(
        and(eq(orders.restaurantId, req.tenant.id), eq(orders.driverId, driverId))
      ).orderBy(desc(orders.createdAt)).limit(100);
    } else {
      query = db.select().from(orders).where(eq(orders.restaurantId, req.tenant.id)).orderBy(desc(orders.createdAt)).limit(100);
    }

    const orderList = await query;
    res.json({ orders: orderList });
  } catch (error) {
    next(error);
  }
});

export default router;
