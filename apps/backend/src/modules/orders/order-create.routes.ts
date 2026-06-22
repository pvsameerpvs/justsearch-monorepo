import { Router } from 'express';
import { sql } from 'drizzle-orm';
import { db } from '../../db';
import { authMiddleware } from '../../middleware/auth.middleware';
import { createOrderSchema } from './order.validators';
import { validateDeliveryOnCreate } from './order-delivery.utils';
import { t, mapRow, mapRows } from '../../lib/tenant-sql';

const router = Router();
router.use(authMiddleware);

// POST /api/v1/orders — create order
router.post('/', async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });
    if (!req.auth?.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const body = createOrderSchema.parse(req.body);
    const restaurantId = req.tenant.id;
    const code = `JS-${Math.floor(1000 + Math.random() * 9000)}`;

    const deliveryCheck = await validateDeliveryOnCreate(
      restaurantId,
      body.fulfillmentType,
      body.lat,
      body.lng,
      body.deliveryFee
    );
    if ('error' in deliveryCheck) {
      return res.status(400).json({ message: deliveryCheck.error });
    }

    const schemaName = req.tenant.schemaName;

    // Resolve promo code if provided
    let promoCodeId: string | null = null;
    let discountAmount: string | null = null;
    if (body.promoCode) {
      const pc = mapRows(await db.execute<Record<string, unknown>>(sql`
        SELECT id, type, value, max_discount, min_order
        FROM ${t(schemaName, 'promo_codes')}
        WHERE restaurant_id = ${restaurantId} AND code = ${body.promoCode.toUpperCase()}
          AND is_active = true
          AND (valid_until IS NULL OR valid_until > NOW())
          AND (usage_limit IS NULL OR usage_count < usage_limit)
        LIMIT 1
      `));
      if (pc[0]) {
        promoCodeId = String(pc[0].id);
        const pcType = String(pc[0].type);
        const pcValue = Number(pc[0].value);
        const maxDiscount = pc[0].maxDiscount ? Number(pc[0].maxDiscount) : null;
        const minOrder = Number(pc[0].min_order);
        // Only apply discount if subtotal meets min order
        if (body.subtotal >= minOrder) {
          if (pcType === 'percentage') {
            const raw = (body.subtotal * pcValue) / 100;
            discountAmount = String(maxDiscount ? Math.min(raw, maxDiscount) : raw);
          } else {
            // flat discount, capped at subtotal
            discountAmount = String(Math.min(pcValue, body.subtotal));
          }
        }
        // Increment usage count
        await db.execute(sql`
          UPDATE ${t(schemaName, 'promo_codes')}
          SET usage_count = usage_count + 1
          WHERE id = ${promoCodeId}
        `);
      }
    }

    const orderRows = await db.execute<Record<string, unknown>>(sql`
      INSERT INTO ${t(schemaName, 'orders')} (
        restaurant_id, code, customer_id, customer_name, customer_phone,
        status, payment_status, fulfillment_type, source,
        subtotal, delivery_fee, tax, total,
        delivery_address, lat, lng, notes, table_id, payment_method,
        promo_code_id, promo_code, discount_amount
      ) VALUES (
        ${restaurantId}, ${code}, ${req.auth.id}, ${body.customerName}, ${body.customerPhone},
        'pending', 'unpaid', ${body.fulfillmentType}, ${body.source || 'direct_web'},
        ${String(body.subtotal)}, ${String(body.deliveryFee)}, ${String(body.tax)}, ${String(body.total)},
        ${body.deliveryAddress || null}, ${body.lat ? String(body.lat) : null}, ${body.lng ? String(body.lng) : null},
        ${body.notes || null}, ${body.tableId || null}, ${body.paymentMethod || null},
        ${promoCodeId}, ${body.promoCode ? body.promoCode.toUpperCase() : null}, ${discountAmount}
      ) RETURNING *
    `);
    const order = mapRow(orderRows[0]);

    const itemValuesSql = body.items.map((item) => sql`(
      ${restaurantId}, ${order.id as string}, ${item.menuItemId}, ${item.name},
      ${item.quantity}, ${String(item.price)}, 'AED'
    )`);

    await db.execute(sql`
      INSERT INTO ${t(schemaName, 'order_items')} (
        restaurant_id, order_id, menu_item_id, name, quantity, price, currency
      ) VALUES ${sql.join(itemValuesSql, sql`, `)}
    `);

    if (body.alternateNumber) {
      try {
        await db.execute(sql`UPDATE ${t(schemaName, 'orders')} SET alternate_number = ${body.alternateNumber} WHERE id = ${order.id}`);
      } catch { /* Column may not exist until migration is run */ }
    }

    // Auto-reward: check for order_threshold campaigns
    const customerId = req.auth.id;
    try {
      const thresholdCampaigns = mapRows(await db.execute<Record<string, unknown>>(sql`
        SELECT * FROM ${t(schemaName, 'scratch_campaigns')}
        WHERE restaurant_id = ${restaurantId}
          AND trigger = 'order_threshold'
          AND is_enabled = true
          AND behavior = 'auto_add'
      `));

      for (const campaign of thresholdCampaigns) {
        let parsedConfig: Record<string, unknown> = {};
        if (campaign.config) {
          try { parsedConfig = typeof campaign.config === 'string' ? JSON.parse(campaign.config) : campaign.config; } catch {}
        }
        const minAmount = Number(parsedConfig.minAmount || 0);
        const orderTotal = Number(order.total || 0);

        if (orderTotal >= minAmount && campaign.voucherCode) {
          const voucherRows = mapRows(await db.execute<Record<string, unknown>>(sql`
            SELECT valid_until FROM ${t(schemaName, 'promo_codes')}
            WHERE restaurant_id = ${restaurantId} AND code = ${String(campaign.voucherCode).toUpperCase()}
            LIMIT 1
          `));
          const expiryAt = voucherRows[0]?.validUntil
            ? new Date(String(voucherRows[0].validUntil)).toISOString()
            : null;

          await db.execute(sql`
            INSERT INTO ${t(schemaName, 'customer_scratch_rewards')}
            (restaurant_id, customer_id, trigger, voucher_code, claimed_at, expiry_at, is_used)
            VALUES (${restaurantId}, ${customerId}, 'auto_voucher', ${String(campaign.voucherCode).toUpperCase()}, NOW(), ${expiryAt}, false)
          `);
        }
      }
    } catch { /* auto-reward failure should not block order creation */ }

    res.status(201).json({ order: { id: order.id, code: order.code, status: order.status, total: order.total, createdAt: order.createdAt } });
  } catch (error) {
    next(error);
  }
});

export default router;
