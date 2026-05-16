import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { saveImage } from './upload.service';

const router = Router();

router.use(authMiddleware);

const uploadSchema = z.object({
  image: z.string().min(1, 'Image data is required'),
  folder: z.string().optional().default('general'),
});

router.post('/', requireRole('owner', 'manager'), async (req, res, next) => {
  try {
    const { image, folder } = uploadSchema.parse(req.body);
    const url = image.startsWith('data:image/') ? await saveImage(image, folder) : image;
    res.status(201).json({ url });
  } catch (error) {
    next(error);
  }
});

export default router;
