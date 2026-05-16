import { Router } from 'express';
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { db } from '../../db';
import { deliveryAgents } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);
router.use(requireRole('driver'));

const AGENT_FIELDS = {
  id: deliveryAgents.id,
  name: deliveryAgents.name,
  phone: deliveryAgents.phone,
  vehicleType: deliveryAgents.vehicleType,
  status: deliveryAgents.status,
  rating: deliveryAgents.rating,
  completedToday: deliveryAgents.completedToday,
  shiftLabel: deliveryAgents.shiftLabel,
  isActive: deliveryAgents.isActive,
  createdAt: deliveryAgents.createdAt,
  updatedAt: deliveryAgents.updatedAt,
} as const;

// GET /api/v1/delivery-agents/me — current driver's profile
router.get('/', async (req, res, next) => {
  try {
    if (!req.tenant || !req.auth) {
      return res.status(400).json({ error: 'Authentication context required' });
    }

    const [agent] = await db
      .select(AGENT_FIELDS)
      .from(deliveryAgents)
      .where(
        and(
          eq(deliveryAgents.id, req.auth.userId),
          eq(deliveryAgents.restaurantId, req.tenant.id)
        )
      )
      .limit(1);

    if (!agent) return res.status(404).json({ error: 'Delivery agent not found' });

    res.json({ agent });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/delivery-agents/me/status — toggle online/offline/busy
router.patch('/status', async (req, res, next) => {
  try {
    if (!req.tenant || !req.auth) {
      return res.status(400).json({ error: 'Authentication context required' });
    }

    const schema = z.object({
      status: z.enum(['online', 'busy', 'offline']),
    });

    const { status } = schema.parse(req.body);

    const [updated] = await db
      .update(deliveryAgents)
      .set({ status, updatedAt: new Date() })
      .where(
        and(
          eq(deliveryAgents.id, req.auth.userId),
          eq(deliveryAgents.restaurantId, req.tenant.id)
        )
      )
      .returning(AGENT_FIELDS);

    if (!updated) return res.status(404).json({ error: 'Delivery agent not found' });

    res.json({ agent: updated });
  } catch (error) {
    next(error);
  }
});

// GPS location tracking not implemented in current schema
// PATCH /api/v1/delivery-agents/me/location placeholder removed

export default router;
