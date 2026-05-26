import { Router } from 'express';
import { z } from 'zod';
import { eq, and, sql } from 'drizzle-orm';
import { db } from '../../db';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { t, mapRow } from '../../lib/tenant-sql';
import { notifyDriverOfNewOrder } from '../push/push.service';

const router = Router();

router.use(authMiddleware);

// PATCH /api/v1/orders/:id/driver — assign driver + set status out_for_delivery
router.patch('/:id/driver', requireRole('owner', 'manager', 'cashier'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const orderId = req.params.id;
    const schema = z.object({ driverId: z.string().uuid() });
    const { driverId } = schema.parse(req.body);
    const schemaName = req.tenant.schemaName;

    const updatedRows = await db.execute<Record<string, unknown>>(sql`
      UPDATE ${t(schemaName, 'orders')}
      SET driver_id = ${driverId}, status = 'out_for_delivery', updated_at = NOW()
      WHERE id = ${orderId} AND restaurant_id = ${req.tenant.id}
      RETURNING *
    `);

    if (!updatedRows[0]) return res.status(404).json({ error: 'Order not found' });
    const updated = mapRow(updatedRows[0]);

    // Check if an assignment already exists for this order — update instead of duplicating
    const existingRows = await db.execute<Record<string, unknown>>(sql`
      SELECT * FROM ${t(schemaName, 'delivery_assignments')}
      WHERE order_id = ${updated.id} AND restaurant_id = ${req.tenant.id}
      LIMIT 1
    `);
    const existing = existingRows[0] ? mapRow(existingRows[0]) : undefined;

    if (existing) {
      await db.execute(sql`
        UPDATE ${t(schemaName, 'delivery_assignments')}
        SET agent_id = ${driverId}, status = 'assigned', assigned_at = NOW(), picked_up_at = NULL, delivered_at = NULL
        WHERE id = ${existing.id}
      `);
    } else {
      await db.execute(sql`
        INSERT INTO ${t(schemaName, 'delivery_assignments')} (
          restaurant_id, order_id, agent_id, status, assigned_at
        ) VALUES (
          ${req.tenant.id}, ${updated.id}, ${driverId}, 'assigned', NOW()
        )
      `);
    }

    // Send push notification to driver (non-blocking)
    notifyDriverOfNewOrder(
      schemaName,
      driverId,
      updated.code as string,
      updated.delivery_address as string || 'No address'
    ).catch(() => {
      // Push failures should not break the assignment response
    });

    res.json({ order: updated });
  } catch (error) {
    next(error);
  }
});

export default router;
