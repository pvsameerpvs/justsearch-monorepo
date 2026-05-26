import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { saveImage, ALLOWED_FOLDERS } from './upload.service';

const router = Router();

router.use(authMiddleware);

const uploadSchema = z.object({
  image: z.string().min(1, 'Image data is required'),
  folder: z
    .string()
    .optional()
    .default('general')
    .refine(
      (val) => ALLOWED_FOLDERS.includes(val as (typeof ALLOWED_FOLDERS)[number]),
      {
        message: `Folder must be one of: ${ALLOWED_FOLDERS.join(', ')}`,
      }
    ),
});

router.post('/', requireRole('owner', 'manager', 'super_admin'), async (req, res, next) => {
  try {
    const { image, folder } = uploadSchema.parse(req.body);
    const url = image.startsWith('data:') ? await saveImage(image, folder as (typeof ALLOWED_FOLDERS)[number]) : image;
    res.status(201).json({ url });
  } catch (error) {
    next(error);
  }
});

export default router;
