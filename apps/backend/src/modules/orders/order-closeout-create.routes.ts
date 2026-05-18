import { Router } from 'express';
import { z } from 'zod';
import { eq, and, gte, lte } from 'drizzle-orm';
import { db } from '../../db';
import { orders, dailyCloseouts } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

// POST /api/v1/close-day — create daily closeout
router.post('/', requireRole('owner', 'manager', 'cashier'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const schema = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) });
    const { date } = schema.parse(req.body);

    const startOfDay = new Date(date + 'T00:00:00');
    const endOfDay = new Date(date + 'T23:59:59');

    const completedOrders = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.restaurantId, req.tenant.id),
          eq(orders.status, 'completed'),
          gte(orders.createdAt, startOfDay),
          lte(orders.createdAt, endOfDay)
        )
      );

    const cashTotal = completedOrders
      .filter((o) => o.paymentMethod === 'cash')
      .reduce((sum, o) => sum + Number(o.total), 0);

    const cardTotal = completedOrders
      .filter((o) => o.paymentMethod === 'card')
      .reduce((sum, o) => sum + Number(o.total), 0);

    const orderCount = completedOrders.length;
    const grandTotal = cashTotal + cardTotal;

    const [closeout] = await db
      .insert(dailyCloseouts)
      .values({
        restaurantId: req.tenant.id,
        date,
        cashTotal: String(cashTotal),
        cardTotal: String(cardTotal),
        orderCount,
        grandTotal: String(grandTotal),
        closedBy: req.auth!.id,
      })
      .returning();

    res.status(201).json({ closeout });
  } catch (error) {
    next(error);
  }
});

export default router;
