import { Router } from 'express';
import createOrderRoutes from './order-create.routes';
import listOrderRoutes from './order-list.routes';
import detailOrderRoutes from './order-detail.routes';
import statusOrderRoutes from './order-status.routes';
import driverOrderRoutes from './order-driver.routes';
import paymentOrderRoutes from './order-payment.routes';
import closeoutOrderRoutes from './order-closeout.routes';

const router = Router();

router.use('/', createOrderRoutes);
router.use('/', listOrderRoutes);
router.use('/', detailOrderRoutes);
router.use('/', statusOrderRoutes);
router.use('/', driverOrderRoutes);
router.use('/', paymentOrderRoutes);
router.use('/close-day', closeoutOrderRoutes);

export default router;
