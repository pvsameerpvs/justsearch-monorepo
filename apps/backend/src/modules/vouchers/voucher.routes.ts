import { Router } from 'express';
import { z } from 'zod';
import { eq, and, desc, sql, SQL } from 'drizzle-orm';
import { db } from '../../db';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { t, mapRow, mapRows } from '../../lib/tenant-sql';

const router = Router();

router.use(authMiddleware);

// GET /api/v1/vouchers — list promo codes for current tenant
router.get('/', async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const schemaName = req.tenant.schemaName;

    const list = mapRows(await db.execute<Record<string, unknown>>(sql`
      SELECT * FROM ${t(schemaName, 'promo_codes')}
      WHERE restaurant_id = ${req.tenant.id}
      ORDER BY created_at DESC
    `));

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
      type: z.enum(['fixed', 'percentage']),
      value: z.number().positive(),
      minOrder: z.number().nonnegative().optional(),
      maxDiscount: z.number().positive().optional(),
      validFrom: z.string().datetime().optional(),
      validUntil: z.string().datetime().optional(),
    });

    const body = schema.parse(req.body);
    const schemaName = req.tenant.schemaName;

    const voucherRows = await db.execute<Record<string, unknown>>(sql`
      INSERT INTO ${t(schemaName, 'promo_codes')} (
        restaurant_id, code, type, value, min_order, max_discount, valid_from, valid_until, is_active
      ) VALUES (
        ${req.tenant.id}, ${body.code.toUpperCase()}, ${body.type}, ${String(body.value)},
        ${String(body.minOrder ?? 0)}, ${body.maxDiscount ? String(body.maxDiscount) : null},
        ${body.validFrom ? new Date(body.validFrom).toISOString() : null}, ${body.validUntil ? new Date(body.validUntil).toISOString() : null}, true
      ) RETURNING *
    `);
    const voucher = mapRow(voucherRows[0]);

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
      type: z.enum(['fixed', 'percentage']).optional(),
      value: z.number().positive().optional(),
      minOrder: z.number().nonnegative().optional(),
      maxDiscount: z.number().positive().optional().nullable(),
      isActive: z.boolean().optional(),
      validFrom: z.string().datetime().optional().nullable(),
      validUntil: z.string().datetime().optional().nullable(),
    });

    const body = schema.parse(req.body);
    const voucherId = req.params.id;
    const schemaName = req.tenant.schemaName;

    const sets: SQL[] = [];
    if (body.code !== undefined) sets.push(sql`code = ${body.code.toUpperCase()}`);
    if (body.type !== undefined) sets.push(sql`type = ${body.type}`);
    if (body.value !== undefined) sets.push(sql`value = ${String(body.value)}`);
    if (body.minOrder !== undefined) sets.push(sql`min_order = ${String(body.minOrder)}`);
    if (body.maxDiscount !== undefined) sets.push(sql`max_discount = ${body.maxDiscount ? String(body.maxDiscount) : null}`);
    if (body.isActive !== undefined) sets.push(sql`is_active = ${body.isActive}`);
    if (body.validFrom !== undefined) sets.push(sql`valid_from = ${body.validFrom ? new Date(body.validFrom).toISOString() : null}`);
    if (body.validUntil !== undefined) sets.push(sql`valid_until = ${body.validUntil ? new Date(body.validUntil).toISOString() : null}`);

    const updatedRows = await db.execute<Record<string, unknown>>(sql`
      UPDATE ${t(schemaName, 'promo_codes')}
      SET ${sql.join(sets, sql`, `)}
      WHERE id = ${voucherId} AND restaurant_id = ${req.tenant.id}
      RETURNING *
    `);

    if (!updatedRows[0]) return res.status(404).json({ error: 'Voucher not found' });
    const updated = mapRow(updatedRows[0]);

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
    const schemaName = req.tenant.schemaName;
    await db.execute(sql`
      DELETE FROM ${t(schemaName, 'promo_codes')}
      WHERE id = ${voucherId} AND restaurant_id = ${req.tenant.id}
    `);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
