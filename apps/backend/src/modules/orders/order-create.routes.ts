import { Router } from 'express';
import { eq, sql } from 'drizzle-orm';
import { db } from '../../db';
import { orders, orderItems, users } from '../../db/schema';
import { authMiddleware } from '../../middleware/auth.middleware';
import { createOrderSchema } from './order.validators';

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

    const [order] = await db.insert(orders).values({
      restaurantId,
      code,
      customerId: req.auth.id,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      status: 'pending',
      paymentStatus: 'unpaid',
      fulfillmentType: body.fulfillmentType,
      source: body.source || 'direct_web',
      subtotal: String(body.subtotal),
      deliveryFee: String(body.deliveryFee),
      tax: String(body.tax),
      total: String(body.total),
      deliveryAddress: body.deliveryAddress || null,
      lat: body.lat ? String(body.lat) : null,
      lng: body.lng ? String(body.lng) : null,
      notes: body.notes || null,
      tableId: body.tableId || null,
      paymentMethod: body.paymentMethod || null,
    }).returning();

    const itemValues = body.items.map((item) => ({
      restaurantId,
      orderId: order.id,
      menuItemId: item.menuItemId,
      name: item.name,
      quantity: item.quantity,
      price: String(item.price),
      currency: 'AED',
    }));

    await db.insert(orderItems).values(itemValues);

    if (body.alternateNumber) {
      try {
        await db.execute(sql`UPDATE ${sql.identifier(req.tenant.schemaName)}.${sql.identifier('orders')} SET alternate_number = ${body.alternateNumber} WHERE id = ${order.id}`);
      } catch { /* Column may not exist until migration is run */ }
    }

    res.status(201).json({ order: { id: order.id, code: order.code, status: order.status, total: order.total, createdAt: order.createdAt } });
  } catch (error) {
    next(error);
  }
});

export default router;
