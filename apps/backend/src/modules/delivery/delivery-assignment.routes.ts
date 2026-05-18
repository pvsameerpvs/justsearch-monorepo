import { Router } from 'express';
import { z } from 'zod';
import { sql } from 'drizzle-orm';
import { db, client } from '../../db';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

// GET /api/v1/delivery-assignments — list assignments for current driver
router.get('/', requireRole('driver', 'owner', 'manager'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ message: 'Tenant context required' });

    const driverId =
      req.auth?.role === 'driver' ? req.auth.id : (req.query.agentId as string);

    if (!driverId) {
      return res.status(400).json({ message: 'Driver ID required' });
    }

    const schemaName = req.tenant.schemaName;

    // Get assignments with order data
    const assignments = await db.execute<Record<string, unknown>>(
      sql`SELECT 
        da.id as assignment_id,
        da.order_id,
        da.agent_id,
        da.status as assignment_status,
        da.assigned_at,
        da.picked_up_at,
        da.delivered_at,
        o.code,
        o.status as order_status,
        o.customer_name,
        o.customer_phone,
        o.subtotal,
        o.delivery_fee,
        o.tax,
        o.total,
        o.delivery_address,
        o.lat,
        o.lng,
        o.notes,
        o.payment_method,
        o.payment_status,
        o.eta_minutes,
        o.created_at
      FROM ${sql.identifier(schemaName)}.${sql.identifier('delivery_assignments')} da
      INNER JOIN public.orders o ON da.order_id = o.id
      WHERE da.restaurant_id = ${req.tenant.id} AND da.agent_id = ${driverId}
      ORDER BY da.assigned_at DESC
      LIMIT 50`
    );

    // Get order items for each assignment
    const enriched = [];
    for (const a of assignments) {
      const orderId = (a as Record<string, unknown>).order_id as string;
      const items = await db.execute<Record<string, unknown>>(
        sql`SELECT name, quantity, price, currency 
        FROM public.order_items 
        WHERE order_id = ${orderId} 
        ORDER BY created_at ASC`
      );
      enriched.push({ ...a, items });
    }

    res.json({ assignments: enriched });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/delivery-assignments/:id/status — update assignment status
router.patch('/:id/status', requireRole('driver', 'owner', 'manager'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ message: 'Tenant context required' });

    const assignmentId = req.params.id;
    const schemaName = req.tenant.schemaName;

    const schema = z.object({
      status: z.enum(['assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled']),
    });

    const { status } = schema.parse(req.body);

    const setFields: string[] = ['status = $1'];
    const params: any[] = [status];

    if (status === 'picked_up') setFields.push('picked_up_at = NOW()');
    if (status === 'delivered') setFields.push('delivered_at = NOW()');

    params.push(assignmentId, req.tenant.id);

    const rawQuery = `UPDATE "${schemaName}"."delivery_assignments" SET ${setFields.join(', ')} WHERE id = $${params.length - 1} AND restaurant_id = $${params.length} RETURNING *`;
    const [updated] = await client.unsafe(rawQuery, params) as Record<string, unknown>[];

    if (!updated) return res.status(404).json({ message: 'Assignment not found' });

    const orderStatusMap = {
      assigned: 'out_for_delivery' as const,
      picked_up: 'out_for_delivery' as const,
      in_transit: 'out_for_delivery' as const,
      delivered: 'completed' as const,
      cancelled: 'cancelled' as const,
    };

    const orderId = updated.order_id as string;

    await db.execute(
      sql`UPDATE public.orders 
      SET status = ${orderStatusMap[status as keyof typeof orderStatusMap]}, 
          updated_at = NOW()
          ${status === 'delivered' ? sql`, payment_status = 'paid'` : sql``}
      WHERE id = ${orderId} AND restaurant_id = ${req.tenant.id}`
    );

    res.json({ assignment: updated });
  } catch (error) {
    next(error);
  }
});

export default router;
