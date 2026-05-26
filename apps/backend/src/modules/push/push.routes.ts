import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { storePushSubscription, removePushSubscription } from './push.service';

const router = Router();

router.use(authMiddleware);

// POST /api/v1/push/subscribe — store driver's push subscription
router.post('/subscribe', requireRole('driver'), async (req, res, next) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ message: 'Tenant context required' });
    }

    const schema = z.object({
      endpoint: z.string().url(),
      expirationTime: z.number().nullable().optional(),
      keys: z.object({
        p256dh: z.string(),
        auth: z.string(),
      }),
    }).transform((data) => ({
      ...data,
      expirationTime: data.expirationTime ?? null,
    }));

    const subscription = schema.parse(req.body);
    const driverId = req.auth?.id;

    if (!driverId) {
      return res.status(401).json({ message: 'Driver ID not found in token' });
    }

    await storePushSubscription(req.tenant.schemaName, driverId, subscription);

    res.json({ success: true, message: 'Push subscription saved' });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/push/unsubscribe — remove driver's push subscription
router.post('/unsubscribe', requireRole('driver'), async (req, res, next) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ message: 'Tenant context required' });
    }

    const schema = z.object({
      endpoint: z.string().url().optional(),
    });

    const { endpoint } = schema.parse(req.body);

    if (endpoint) {
      await removePushSubscription(req.tenant.schemaName, endpoint);
    } else {
      // Clear all subscriptions for this driver
      const driverId = req.auth?.id;
      if (driverId) {
        const { sql } = await import('drizzle-orm');
        const { db } = await import('../../db');
        await db.execute(
          sql`UPDATE ${sql.identifier(req.tenant.schemaName)}.${sql.identifier('delivery_agents')}
              SET push_subscription = NULL, updated_at = NOW()
              WHERE id = ${driverId}`
        );
      }
    }

    res.json({ success: true, message: 'Push subscription removed' });
  } catch (error) {
    next(error);
  }
});

export default router;
