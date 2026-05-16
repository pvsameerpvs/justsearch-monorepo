import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { restaurants } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { updateRestaurantSchema } from './restaurant-create.utils';
import { dropTenantSchema, backupTenantSchema } from '../../db/tenant-template';

const router = Router();

router.patch('/:id', authMiddleware, requireRole('super_admin'), async (req, res, next) => {
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

router.delete('/:id', authMiddleware, requireRole('super_admin'), async (req, res, next) => {
  try {
    const [existing] = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.id, req.params.id))
      .limit(1);

    if (!existing) return res.status(404).json({ error: 'Restaurant not found' });

    // 1. Backup all tenant data before destruction
    const backupPath = await backupTenantSchema(existing.schemaName, existing.slug);

    // 2. Drop the entire schema + all tables + all data
    await dropTenantSchema(existing.schemaName);

    // 3. Remove registry row
    await db.delete(restaurants).where(eq(restaurants.id, req.params.id));

    res.status(200).json({
      message: 'Restaurant deleted successfully',
      backup: backupPath,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
