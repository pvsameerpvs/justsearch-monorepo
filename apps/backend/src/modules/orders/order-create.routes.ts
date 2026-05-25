import { Router } from 'express';
import { eq, sql } from 'drizzle-orm';
import { db } from '../../db';
import { users } from '../../db/schema';
import { authMiddleware } from '../../middleware/auth.middleware';
import { createOrderSchema } from './order.validators';
import { validateDeliveryOnCreate } from './order-delivery.utils';
import { t, mapRow } from '../../lib/tenant-sql';

const router = Router();
router.use(authMiddleware);

// POST /api/v1/orders — create order
router.post('/', async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });
    if (!req.auth?.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Validate user still exists in public.users (stale JWT after migration 0007)
    const [user] = await db.select().from(users).where(eq(users.id, req.auth.id)).limit(1);
    if (!user) {
      return res.status(401).json({ error: 'Session expired. Please sign in again.' });
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

    const orderRows = await db.execute<Record<string, unknown>>(sql`
      INSERT INTO ${t(schemaName, 'orders')} (
        restaurant_id, code, customer_id, customer_name, customer_phone,
        status, payment_status, fulfillment_type, source,
        subtotal, delivery_fee, tax, total,
        delivery_address, lat, lng, notes, table_id, payment_method
      ) VALUES (
        ${restaurantId}, ${code}, ${req.auth.id}, ${body.customerName}, ${body.customerPhone},
        'pending', 'unpaid', ${body.fulfillmentType}, ${body.source || 'direct_web'},
        ${String(body.subtotal)}, ${String(body.deliveryFee)}, ${String(body.tax)}, ${String(body.total)},
        ${body.deliveryAddress || null}, ${body.lat ? String(body.lat) : null}, ${body.lng ? String(body.lng) : null},
        ${body.notes || null}, ${body.tableId || null}, ${body.paymentMethod || null}
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

    res.status(201).json({ order: { id: order.id, code: order.code, status: order.status, total: order.total, createdAt: order.createdAt } });
  } catch (error) {
    next(error);
  }
});

export default router;
