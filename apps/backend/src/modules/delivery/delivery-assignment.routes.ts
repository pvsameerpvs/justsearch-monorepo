import { Router } from 'express';
import { z } from 'zod';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '../../db';
import { deliveryAssignments, orders } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

// GET /api/v1/delivery-assignments — list assignments for current driver
router.get('/', requireRole('driver', 'owner', 'manager'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const driverId =
      req.auth?.role === 'driver' ? req.auth.userId : (req.query.agentId as string);

    if (!driverId) {
      return res.status(400).json({ error: 'Driver ID required' });
    }

    const list = await db
      .select({
        id: deliveryAssignments.id,
        orderId: deliveryAssignments.orderId,
        agentId: deliveryAssignments.agentId,
        status: deliveryAssignments.status,
        assignedAt: deliveryAssignments.assignedAt,
        pickedUpAt: deliveryAssignments.pickedUpAt,
        deliveredAt: deliveryAssignments.deliveredAt,
        orderCode: orders.code,
        orderStatus: orders.status,
        customerName: orders.customerName,
        total: orders.total,
        deliveryAddress: orders.deliveryAddress,
        paymentMethod: orders.paymentMethod,
      })
      .from(deliveryAssignments)
      .innerJoin(orders, eq(deliveryAssignments.orderId, orders.id))
      .where(
        and(
          eq(deliveryAssignments.restaurantId, req.tenant.id),
          eq(deliveryAssignments.agentId, driverId)
        )
      )
      .orderBy(desc(deliveryAssignments.assignedAt))
      .limit(50);

    res.json({ assignments: list });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/delivery-assignments/:id/status — update assignment status
router.patch('/:id/status', requireRole('driver', 'owner', 'manager'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const assignmentId = req.params.id;

    const schema = z.object({
      status: z.enum(['assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled']),
    });

    const { status } = schema.parse(req.body);

    const updateData: Record<string, unknown> = { status };

    if (status === 'picked_up') updateData.pickedUpAt = new Date();
    if (status === 'delivered') updateData.deliveredAt = new Date();

    const [updated] = await db
      .update(deliveryAssignments)
      .set(updateData)
      .where(
        and(
          eq(deliveryAssignments.id, assignmentId),
          eq(deliveryAssignments.restaurantId, req.tenant.id),
          ...(req.auth?.role === 'driver'
            ? [eq(deliveryAssignments.agentId, req.auth.userId)]
            : [])
        )
      )
      .returning();

    if (!updated) return res.status(404).json({ error: 'Assignment not found' });

    const orderStatusMap = {
      assigned: 'out_for_delivery' as const,
      picked_up: 'out_for_delivery' as const,
      in_transit: 'out_for_delivery' as const,
      delivered: 'completed' as const,
      cancelled: 'cancelled' as const,
    };

    await db
      .update(orders)
      .set({
        status: orderStatusMap[status as keyof typeof orderStatusMap],
        updatedAt: new Date(),
        ...(status === 'delivered' ? { paymentStatus: 'paid' } : {}),
      })
      .where(
        and(eq(orders.id, updated.orderId), eq(orders.restaurantId, req.tenant.id))
      );

    res.json({ assignment: updated });
  } catch (error) {
    next(error);
  }
});

export default router;
