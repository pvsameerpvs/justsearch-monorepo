import { Router } from 'express';
import { z } from 'zod';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '../../db';
import { promoCodes } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

// GET /api/v1/vouchers — list promo codes for current tenant
router.get('/', async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const list = await db
      .select()
      .from(promoCodes)
      .where(eq(promoCodes.restaurantId, req.tenant.id))
      .orderBy(desc(promoCodes.createdAt));

    res.json({ vouchers: list });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/vouchers — create promo code
router.post('/', requireRole('owner', 'manager'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const schema = z.object({
      code: z.string().min(3).max(50),
      title: z.string().max(255).optional(),
      description: z.string().optional(),
      type: z.enum(['fixed', 'percentage']),
      value: z.number().positive(),
      minOrder: z.number().nonnegative().optional(),
      maxDiscount: z.number().positive().optional(),
      usageLimit: z.number().int().nonnegative().optional(),
      validFrom: z.string().datetime().optional(),
      validUntil: z.string().datetime().optional(),
    });

    const body = schema.parse(req.body);

    const [voucher] = await db
      .insert(promoCodes)
      .values({
        restaurantId: req.tenant.id,
        code: body.code.toUpperCase(),
        title: body.title,
        description: body.description,
        type: body.type,
        value: String(body.value),
        minOrder: String(body.minOrder ?? 0),
        maxDiscount: body.maxDiscount ? String(body.maxDiscount) : null,
        usageLimit: body.usageLimit ?? 0,
        validFrom: body.validFrom ? new Date(body.validFrom) : null,
        validUntil: body.validUntil ? new Date(body.validUntil) : null,
        isActive: true,
      })
      .returning();

    res.status(201).json({ voucher });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/vouchers/:id
router.patch('/:id', requireRole('owner', 'manager'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const schema = z.object({
      code: z.string().min(3).max(50).optional(),
      title: z.string().max(255).optional().nullable(),
      description: z.string().optional().nullable(),
      type: z.enum(['fixed', 'percentage']).optional(),
      value: z.number().positive().optional(),
      minOrder: z.number().nonnegative().optional(),
      maxDiscount: z.number().positive().optional().nullable(),
      usageLimit: z.number().int().nonnegative().optional(),
      isActive: z.boolean().optional(),
      validFrom: z.string().datetime().optional().nullable(),
      validUntil: z.string().datetime().optional().nullable(),
    });

    const body = schema.parse(req.body);
    const voucherId = req.params.id;

    const updateData: Record<string, unknown> = {};
    if (body.code !== undefined) updateData.code = body.code.toUpperCase();
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.value !== undefined) updateData.value = String(body.value);
    if (body.minOrder !== undefined) updateData.minOrder = String(body.minOrder);
    if (body.maxDiscount !== undefined) updateData.maxDiscount = body.maxDiscount ? String(body.maxDiscount) : null;
    if (body.usageLimit !== undefined) updateData.usageLimit = body.usageLimit;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.validFrom !== undefined) updateData.validFrom = body.validFrom ? new Date(body.validFrom) : null;
    if (body.validUntil !== undefined) updateData.validUntil = body.validUntil ? new Date(body.validUntil) : null;

    const [updated] = await db
      .update(promoCodes)
      .set(updateData)
      .where(and(eq(promoCodes.id, voucherId), eq(promoCodes.restaurantId, req.tenant.id)))
      .returning();

    if (!updated) return res.status(404).json({ error: 'Voucher not found' });

    res.json({ voucher: updated });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/vouchers/:id
router.delete('/:id', requireRole('owner', 'manager'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const voucherId = req.params.id;
    await db.delete(promoCodes).where(
      and(eq(promoCodes.id, voucherId), eq(promoCodes.restaurantId, req.tenant.id))
    );

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
