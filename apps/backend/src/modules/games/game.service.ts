import { eq } from 'drizzle-orm';
import { db, client } from '../../db';
import { games } from '../../db/schema';
import type { z } from 'zod';
import type { updateGameSchema } from './game.schema';

type UpdateInput = z.infer<typeof updateGameSchema>;

export async function updateGame(id: string, input: UpdateInput) {
  const body: UpdateInput = { ...input };

  if (body.config) {
    const [existing] = await db
      .select({ config: games.config })
      .from(games)
      .where(eq(games.id, id))
      .limit(1);
    if (existing) {
      body.config = { ...(existing.config as Record<string, unknown>), ...body.config };
    }
  }

  const [updated] = await db
    .update(games)
    .set(body)
    .where(eq(games.id, id))
    .returning();

  if (!updated) return null;

  if (body.isActive === false) {
    await client.unsafe(
      `UPDATE advertisements SET is_active = false WHERE is_active = true AND assigned_games ? $1`,
      [id]
    );
  }

  return updated;
}
