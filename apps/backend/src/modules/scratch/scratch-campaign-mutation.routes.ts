import { Router } from 'express';
import patchRoutes from './scratch-campaign-patch.routes';
import seedRoutes from './scratch-campaign-seed.routes';

const router = Router();

router.use('/', patchRoutes);
router.use('/', seedRoutes);

export default router;
