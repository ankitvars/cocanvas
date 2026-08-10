import { z } from 'zod';

export const createBoardSchema = z.object({
  name: z.string().min(1, 'Board name is required').max(100, 'Board name must be less than 100 characters'),
  isPublic: z.boolean().default(false),
});

export const updateBoardSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  isPublic: z.boolean().optional(),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;
