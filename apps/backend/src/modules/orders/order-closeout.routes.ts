import { Router } from 'express';
import createCloseoutRoutes from './order-closeout-create.routes';
import listCloseoutRoutes from './order-closeout-list.routes';

const router = Router();

router.use('/', createCloseoutRoutes);
router.use('/', listCloseoutRoutes);

export default router;
