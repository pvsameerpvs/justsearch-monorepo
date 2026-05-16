import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { restaurants } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { updateRestaurantSchema } from './restaurant-create.utils';
import { dropTenantSchema } from '../../db/tenant-template';

const router = Router();
router.use(authMiddleware);

router.patch('/:id', requireRole('super_admin'), async (req, res, next) => {
  try {
    const body = updateRestaurantSchema.parse(req.body);
    const updateData: Record<string, unknown> = {};
    if (body.name) updateData.name = body.name;
    if (body.status) updateData.status = body.status;

    if (body.settings || body.ownerName || body.contactPhone || body.contactEmail) {
      const [existing] = await db
        .select({ settings: restaurants.settings })
        .from(restaurants)
        .where(eq(restaurants.id, req.params.id))
        .limit(1);

      const currentSettings = existing && typeof existing.settings === 'object' && existing.settings !== null
        ? (existing.settings as Record<string, unknown>)
        : {};

      const merged = { ...currentSettings, ...body.settings };
      if (body.ownerName) merged.ownerName = body.ownerName;
      if (body.contactPhone) merged.contactPhone = body.contactPhone;
      if (body.contactEmail) merged.contactEmail = body.contactEmail;
      updateData.settings = merged;
    }

    updateData.updatedAt = new Date();

    const [updated] = await db
      .update(restaurants)
      .set(updateData)
      .where(eq(restaurants.id, req.params.id))
      .returning();

    if (!updated) return res.status(404).json({ error: 'Restaurant not found' });
    res.json({ restaurant: updated });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireRole('super_admin'), async (req, res, next) => {
  try {
    const [existing] = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.id, req.params.id))
      .limit(1);

    if (!existing) return res.status(404).json({ error: 'Restaurant not found' });

    await dropTenantSchema(existing.schemaName);
    await db.delete(restaurants).where(eq(restaurants.id, req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
