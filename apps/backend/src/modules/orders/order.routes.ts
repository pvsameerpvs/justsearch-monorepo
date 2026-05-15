import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../db';
import { orders, orderItems, users } from '../../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();

// All order routes require authentication
router.use(authMiddleware);

const createOrderSchema = z.object({
  customerName: z.string().min(1).max(255),
  customerPhone: z.string().min(8).max(20),
  fulfillmentType: z.enum(['dine_in', 'delivery', 'pickup']),
  source: z.enum(['public_qr', 'table_qr', 'direct_web', 'dashboard']).optional(),
  items: z.array(
    z.object({
      menuItemId: z.string().uuid(),
      name: z.string().min(1),
      quantity: z.number().int().min(1),
      price: z.number().positive(),
    })
  ).min(1),
  subtotal: z.number().nonnegative(),
  deliveryFee: z.number().nonnegative().default(0),
  tax: z.number().nonnegative().default(0),
  total: z.number().positive(),
  deliveryAddress: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  notes: z.string().max(1000).optional(),
  tableId: z.string().uuid().optional(),
});

// POST /api/v1/orders — create order (customer or staff)
router.post('/', async (req, res, next) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant context required' });
    }

    const body = createOrderSchema.parse(req.body);
    const restaurantId = req.tenant.id;

    // Generate order code (simplified: JS-XXXX format)
    const code = `JS-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create order
    const [order] = await db
      .insert(orders)
      .values({
        restaurantId,
        code,
        customerId: req.auth?.userId || null,
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
      })
      .returning();

    // Create order items
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

    res.status(201).json({
      order: {
        id: order.id,
        code: order.code,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/orders — list orders (staff only)
router.get('/', requireRole('owner', 'manager', 'cashier', 'kitchen_staff'), async (req, res, next) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant context required' });
    }

    const orderList = await db
      .select()
      .from(orders)
      .where(eq(orders.restaurantId, req.tenant.id))
      .orderBy(desc(orders.createdAt))
      .limit(100);

    res.json({ orders: orderList });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/orders/:id — get order details
router.get('/:id', async (req, res, next) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant context required' });
    }

    const orderId = req.params.id;
    const [order] = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.id, orderId),
          eq(orders.restaurantId, req.tenant.id)
        )
      )
      .limit(1);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    res.json({ order, items });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/orders/:id/status — update order status (staff only)
router.patch('/:id/status', requireRole('owner', 'manager', 'cashier', 'kitchen_staff'), async (req, res, next) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant context required' });
    }

    const orderId = req.params.id;
    const statusSchema = z.object({
      status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled']),
    });
    const { status } = statusSchema.parse(req.body);

    const [updated] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(
        and(
          eq(orders.id, orderId),
          eq(orders.restaurantId, req.tenant.id)
        )
      )
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order: updated });
  } catch (error) {
    next(error);
  }
});

export default router;
