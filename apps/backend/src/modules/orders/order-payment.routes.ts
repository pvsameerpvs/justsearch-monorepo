import { Router } from 'express';
import { z } from 'zod';
import { sql } from 'drizzle-orm';
import { db } from '../../db';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { t, mapRow } from '../../lib/tenant-sql';

const router = Router();

router.use(authMiddleware);

// PATCH /api/v1/orders/:id/payment — driver records payment mode
router.patch('/:id/payment', requireRole('owner', 'manager', 'cashier', 'driver'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const orderId = req.params.id;
    const schema = z.object({
      paymentMethod: z.enum(['cash', 'card']),
      paymentStatus: z.enum(['unpaid', 'paid']).optional(),
    });
    const { paymentMethod, paymentStatus } = schema.parse(req.body);
    const schemaName = req.tenant.schemaName;

    const updatedRows = await db.execute<Record<string, unknown>>(sql`
      UPDATE ${t(schemaName, 'orders')}
      SET payment_method = ${paymentMethod}, payment_status = ${paymentStatus || 'paid'}, updated_at = NOW()
      WHERE id = ${orderId} AND restaurant_id = ${req.tenant.id}
      RETURNING *
    `);

    if (!updatedRows[0]) return res.status(404).json({ error: 'Order not found' });
    const updated = mapRow(updatedRows[0]);
    res.json({ order: updated });
  } catch (error) {
    next(error);
  }
});

export default router;
