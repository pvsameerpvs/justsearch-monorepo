import { Router } from 'express';
import { eq, and, sql } from 'drizzle-orm';
import { db } from '../../db';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { updateStatusSchema } from './order.validators';
import { t, mapRow } from '../../lib/tenant-sql';

const router = Router();
router.use(authMiddleware);

// PATCH /api/v1/orders/:id/status — update order status
router.patch('/:id/status', requireRole('owner', 'manager', 'cashier', 'kitchen_staff', 'driver'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const orderId = req.params.id;
    const { status, cancelReason } = updateStatusSchema.parse(req.body);
    const schemaName = req.tenant.schemaName;

    const updatedRows = await db.execute<Record<string, unknown>>(sql`
      UPDATE ${t(schemaName, 'orders')}
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${orderId} AND restaurant_id = ${req.tenant.id}
      RETURNING *
    `);

    if (!updatedRows[0]) return res.status(404).json({ error: 'Order not found' });
    const updated = mapRow(updatedRows[0]);

    // Raw SQL for cancel_reason so it works regardless of Drizzle schema sync
    if (status === 'cancelled' && cancelReason) {
      try {
        await db.execute(
          sql`UPDATE ${t(schemaName, 'orders')} SET cancel_reason = ${cancelReason}, updated_at = NOW() WHERE id = ${orderId} AND restaurant_id = ${req.tenant.id}`
        );
      } catch {
        // Column may not exist until migration is run — ignore so status update still succeeds
      }
    }

    res.json({ order: updated });
  } catch (error) {
    next(error);
  }
});

export default router;
