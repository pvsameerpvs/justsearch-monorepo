import { z } from 'zod';

export const createGameSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  type: z.string().min(1),
  config: z.record(z.unknown()).optional(),
  isActive: z.boolean().optional(),
});

export const updateGameSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  config: z.record(z.unknown()).optional(),
  isActive: z.boolean().optional(),
});
