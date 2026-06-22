import { Router } from 'express';
import myRoutes from './scratch-reward-my.routes';
import claimRoutes from './scratch-reward-claim.routes';
import useRoutes from './scratch-reward-use.routes';

const router = Router();

router.use('/', myRoutes);
router.use('/', claimRoutes);
router.use('/', useRoutes);

export default router;
