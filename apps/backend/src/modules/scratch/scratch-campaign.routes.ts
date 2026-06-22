import { Router } from 'express';
import listRoutes from './scratch-campaign-list.routes';
import mutationRoutes from './scratch-campaign-mutation.routes';

const router = Router();

router.use('/', listRoutes);
router.use('/', mutationRoutes);

export default router;
