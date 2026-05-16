import { Router } from 'express';
import { z } from 'zod';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '../../db';
import { deliveryAgents } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { hashPassword } from '../../lib/hash';

const router = Router();

router.use(authMiddleware);

function stripPassword(agent: Record<string, unknown>) {
  const { passwordHash, ...rest } = agent;
  return rest;
}

// GET /api/v1/delivery-agents — list agents for current tenant
router.get('/', async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const list = await db
      .select()
      .from(deliveryAgents)
      .where(eq(deliveryAgents.restaurantId, req.tenant.id))
      .orderBy(desc(deliveryAgents.createdAt));

    res.json({ agents: list.map(stripPassword) });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/delivery-agents — create new agent
router.post('/', requireRole('owner', 'manager'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const schema = z.object({
      name: z.string().min(2),
      phone: z.string().min(10),
      email: z.string().email().optional().or(z.literal('')),
      location: z.string().optional(),
      username: z.string().min(3),
      password: z.string().min(6),
      vehicleType: z.enum(['bike', 'scooter', 'car']).default('scooter'),
    });

    const body = schema.parse(req.body);
    const passwordHash = await hashPassword(body.password);

    const [agent] = await db
      .insert(deliveryAgents)
      .values({
        restaurantId: req.tenant.id,
        name: body.name,
        phone: body.phone,
        email: body.email || null,
        location: body.location || null,
        username: body.username,
        passwordHash,
        vehicleType: body.vehicleType,
        status: 'offline',
        isActive: true,
      })
      .returning();

    res.status(201).json({ agent: stripPassword(agent as unknown as Record<string, unknown>) });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/delivery-agents/:id — update agent
router.patch('/:id', requireRole('owner', 'manager'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const schema = z.object({
      name: z.string().min(2).optional(),
      phone: z.string().min(10).optional(),
      email: z.string().email().optional().nullable(),
      location: z.string().optional().nullable(),
      vehicleType: z.enum(['bike', 'scooter', 'car']).optional(),
      password: z.string().min(6).optional(),
      isActive: z.boolean().optional(),
      status: z.enum(['online', 'busy', 'offline']).optional(),
    });

    const body = schema.parse(req.body);
    const agentId = req.params.id;

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (body.name !== undefined) updateData.name = body.name;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.vehicleType !== undefined) updateData.vehicleType = body.vehicleType;
    if (body.password) updateData.passwordHash = await hashPassword(body.password);
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.status !== undefined) updateData.status = body.status;

    const [updated] = await db
      .update(deliveryAgents)
      .set(updateData)
      .where(and(eq(deliveryAgents.id, agentId), eq(deliveryAgents.restaurantId, req.tenant.id)))
      .returning();

    if (!updated) return res.status(404).json({ error: 'Agent not found' });

    res.json({ agent: stripPassword(updated as unknown as Record<string, unknown>) });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/delivery-agents/:id
router.delete('/:id', requireRole('owner', 'manager'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const agentId = req.params.id;
    await db.delete(deliveryAgents).where(
      and(eq(deliveryAgents.id, agentId), eq(deliveryAgents.restaurantId, req.tenant.id))
    );

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
