import { Router } from 'express';
import { eq, and } from 'drizzle-orm';
import { db } from '../../db';
import { addresses } from '../../db/schema';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

// GET /api/v1/addresses — list authenticated user's addresses
router.get('/', async (req, res, next) => {
  try {
    if (!req.auth) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const list = await db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, req.auth.id))
      .orderBy(addresses.createdAt);

    res.json({ addresses: list });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/addresses — create a new address
router.post('/', async (req, res, next) => {
  try {
    if (!req.auth) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const body = req.body as {
      label?: string;
      address?: string;
      details?: string;
      alternateNumber?: string;
      isDefault?: boolean;
      lat?: number;
      lng?: number;
    };

    if (!body.label || !body.address) {
      return res.status(400).json({ error: 'Label and address are required' });
    }

    const [created] = await db
      .insert(addresses)
      .values({
        userId: req.auth.id,
        label: body.label,
        address: body.address,
        details: body.details || null,
        alternateNumber: body.alternateNumber || null,
        isDefault: body.isDefault ?? false,
        lat: body.lat ?? null,
        lng: body.lng ?? null,
      })
      .returning();

    res.status(201).json({ address: created });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/addresses/:id — update an address
router.patch('/:id', async (req, res, next) => {
  try {
    if (!req.auth) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const id = req.params.id;

    const [existing] = await db
      .select()
      .from(addresses)
      .where(and(eq(addresses.id, id), eq(addresses.userId, req.auth.id)))
      .limit(1);

    if (!existing) {
      return res.status(404).json({ error: 'Address not found' });
    }

    const body = req.body as {
      label?: string;
      address?: string;
      details?: string;
      alternateNumber?: string;
      lat?: number;
      lng?: number;
    };

    if (!body.address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    const [updated] = await db
      .update(addresses)
      .set({
        label: body.label || existing.label,
        address: body.address,
        details: body.details || null,
        alternateNumber: body.alternateNumber || null,
        lat: body.lat ?? existing.lat,
        lng: body.lng ?? existing.lng,
        updatedAt: new Date(),
      })
      .where(eq(addresses.id, id))
      .returning();

    res.json({ address: updated });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/addresses/:id — delete an address
router.delete('/:id', async (req, res, next) => {
  try {
    if (!req.auth) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const id = req.params.id;

    const [existing] = await db
      .select()
      .from(addresses)
      .where(and(eq(addresses.id, id), eq(addresses.userId, req.auth.id)))
      .limit(1);

    if (!existing) {
      return res.status(404).json({ error: 'Address not found' });
    }

    await db
      .delete(addresses)
      .where(eq(addresses.id, id));

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
