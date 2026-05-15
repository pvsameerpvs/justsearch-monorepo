import { Router } from 'express';
import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';
import { db } from '../../db';
import { advertisements } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

const createSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  content: z.string().optional(),
  imageUrl: z.string().optional(),
  targetRestaurants: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

const updateSchema = createSchema.partial();

router.get('/', requireRole('super_admin'), async (_req, res, next) => {
  try {
    const list = await db.select().from(advertisements).orderBy(desc(advertisements.createdAt));
    res.json({ advertisements: list });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireRole('super_admin'), async (req, res, next) => {
  try {
    const body = createSchema.parse(req.body);
    const values = {
      ...body,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
    };
    const [ad] = await db.insert(advertisements).values(values).returning();
    res.status(201).json({ advertisement: ad });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', requireRole('super_admin'), async (req, res, next) => {
  try {
    const body = updateSchema.parse(req.body);
    const values = {
      ...body,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
    };
    const [updated] = await db
      .update(advertisements)
      .set(values)
      .where(eq(advertisements.id, req.params.id))
      .returning();
    if (!updated) return res.status(404).json({ error: 'Advertisement not found' });
    res.json({ advertisement: updated });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireRole('super_admin'), async (req, res, next) => {
  try {
    await db.delete(advertisements).where(eq(advertisements.id, req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
