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
      usageLimit: z.number().nonnegative().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      validFrom: z.string().optional(),
      validUntil: z.string().optional(),
    });

    const body = schema.parse(req.body);
    const schemaName = req.tenant.schemaName;

    // Parse dates from YYYY-MM-DD or MM/DD/YYYY to ISO
    const parseDate = (dateStr: string | undefined): string | null => {
      if (!dateStr) return null;
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? null : d.toISOString();
    };

    const voucherRows = await db.execute<Record<string, unknown>>(sql`
      INSERT INTO ${t(schemaName, 'promo_codes')} (
        restaurant_id, code, title, description, type, value, min_order, max_discount, usage_limit, valid_from, valid_until, is_active
      ) VALUES (
        ${req.tenant.id}, ${body.code.toUpperCase()}, ${body.title || null}, ${body.description || null},
        ${body.type}, ${String(body.value)},
        ${String(body.minOrder ?? 0)}, ${body.maxDiscount ? String(body.maxDiscount) : null},
        ${body.usageLimit ?? null},
        ${parseDate(body.validFrom)}, ${parseDate(body.validUntil)}, true
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
      title: z.string().optional().nullable(),
      description: z.string().optional().nullable(),
      type: z.enum(['fixed', 'percentage']).optional(),
      value: z.number().positive().optional(),
      minOrder: z.number().nonnegative().optional(),
      maxDiscount: z.number().positive().optional().nullable(),
      usageLimit: z.number().nonnegative().optional().nullable(),
      isActive: z.boolean().optional(),
      validFrom: z.string().optional().nullable(),
      validUntil: z.string().optional().nullable(),
    });

    const body = schema.parse(req.body);
    const voucherId = req.params.id;
    const schemaName = req.tenant.schemaName;

    const parseDate = (dateStr: string | null | undefined): string | null => {
      if (!dateStr) return null;
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? null : d.toISOString();
    };

    const sets: SQL[] = [];
    if (body.code !== undefined) sets.push(sql`code = ${body.code.toUpperCase()}`);
    if (body.title !== undefined) sets.push(sql`title = ${body.title}`);
    if (body.description !== undefined) sets.push(sql`description = ${body.description}`);
    if (body.type !== undefined) sets.push(sql`type = ${body.type}`);
    if (body.value !== undefined) sets.push(sql`value = ${String(body.value)}`);
    if (body.minOrder !== undefined) sets.push(sql`min_order = ${String(body.minOrder)}`);
    if (body.maxDiscount !== undefined) sets.push(sql`max_discount = ${body.maxDiscount ? String(body.maxDiscount) : null}`);
    if (body.usageLimit !== undefined) sets.push(sql`usage_limit = ${body.usageLimit !== null ? String(body.usageLimit) : null}`);
    if (body.isActive !== undefined) sets.push(sql`is_active = ${body.isActive}`);
    if (body.validFrom !== undefined) sets.push(sql`valid_from = ${parseDate(body.validFrom)}`);
    if (body.validUntil !== undefined) sets.push(sql`valid_until = ${parseDate(body.validUntil)}`);

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

// POST /api/v1/vouchers/validate — validate a promo code (customer-facing)
router.post('/validate', async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const schema = z.object({
      code: z.string().min(1).max(50),
      subtotal: z.number().nonnegative(),
    });
    const body = schema.parse(req.body);
    const schemaName = req.tenant.schemaName;

    const codes = mapRows(await db.execute<Record<string, unknown>>(sql`
      SELECT * FROM ${t(schemaName, 'promo_codes')}
      WHERE restaurant_id = ${req.tenant.id}
        AND code = ${body.code.toUpperCase()}
        AND is_active = true
        AND (valid_from IS NULL OR valid_from <= NOW())
        AND (valid_until IS NULL OR valid_until > NOW())
        AND (usage_limit IS NULL OR usage_count < usage_limit)
      LIMIT 1
    `));

    if (!codes[0]) {
      return res.json({ valid: false, reason: 'Invalid or expired promo code' });
    }

    const pc = codes[0];
    const minOrder = Number(pc.min_order ?? 0);
    if (body.subtotal < minOrder) {
      return res.json({
        valid: false,
        reason: `Minimum order of AED ${minOrder.toFixed(2)} required for this code`,
      });
    }

    const pcType = String(pc.type);
    const pcValue = Number(pc.value);
    const maxDiscount = pc.maxDiscount ? Number(pc.maxDiscount) : null;
    let discount = 0;

    if (pcType === 'percentage') {
      const raw = (body.subtotal * pcValue) / 100;
      discount = maxDiscount ? Math.min(raw, maxDiscount) : raw;
    } else {
      discount = Math.min(pcValue, body.subtotal);
    }
    discount = Math.round(discount * 100) / 100;

    const remaining = pc.usage_limit !== null ? Number(pc.usage_limit) - Number(pc.usage_count ?? 0) : null;

    res.json({
      valid: true,
      discount,
      voucher: {
        id: pc.id,
        code: pc.code,
        title: pc.title || null,
        type: pc.type,
        value: Number(pc.value),
        minOrder,
        maxDiscount: pc.maxDiscount ? Number(pc.maxDiscount) : null,
        usageLimit: pc.usage_limit !== null ? Number(pc.usage_limit) : null,
        usageCount: Number(pc.usage_count ?? 0),
        remaining,
        validFrom: pc.valid_from || null,
        validUntil: pc.valid_until || null,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/vouchers/active — list active, non-expired promo codes (customer-facing)
router.get('/active', async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const schemaName = req.tenant.schemaName;

    const list = mapRows(await db.execute<Record<string, unknown>>(sql`
      SELECT * FROM ${t(schemaName, 'promo_codes')}
      WHERE restaurant_id = ${req.tenant.id}
        AND is_active = true
        AND (valid_from IS NULL OR valid_from <= NOW())
        AND (valid_until IS NULL OR valid_until > NOW())
        AND (usage_limit IS NULL OR usage_count < usage_limit)
      ORDER BY created_at DESC
    `));

    res.json({
      vouchers: list.map((pc) => ({
        id: pc.id,
        code: pc.code,
        title: pc.title || null,
        type: pc.type,
        value: Number(pc.value),
        minOrder: Number(pc.min_order ?? 0),
        maxDiscount: pc.max_discount ? Number(pc.max_discount) : null,
        validUntil: pc.valid_until || null,
      })),
    });
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
