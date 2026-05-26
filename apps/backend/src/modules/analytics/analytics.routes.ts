import { Router } from 'express';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import {
  fetchTodayOrders,
  fetchAllOrders,
  fetchCustomerCount,
  fetchAdStats,
  fetchOrderItems,
  buildTrend,
} from './analytics.service';
import { buildSummary, buildTopItems } from './analytics.builders';

const router = Router();

router.use(authMiddleware);

router.get('/summary', requireRole('owner', 'manager'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });
    const { schemaName, id } = req.tenant;

    const [todayOrders, allOrders, totalCustomers, { adRevenue, adViews }] = await Promise.all([
      fetchTodayOrders(schemaName, id),
      fetchAllOrders(schemaName, id),
      fetchCustomerCount(id),
      fetchAdStats(id),
    ]);

    res.json({
      ...buildSummary(todayOrders, allOrders),
      adRevenue: Math.round(adRevenue),
      adViews,
      totalCustomers,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/orders', requireRole('owner', 'manager'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });
    const days = typeof req.query.days === 'string' ? parseInt(req.query.days, 10) : 7;
    const allOrders = await fetchAllOrders(req.tenant.schemaName, req.tenant.id);
    res.json({ trend: buildTrend(allOrders, days) });
  } catch (error) {
    next(error);
  }
});

router.get('/top-items', requireRole('owner', 'manager'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });
    const items = await fetchOrderItems(req.tenant.schemaName, req.tenant.id);
    res.json({ topItems: buildTopItems(items) });
  } catch (error) {
    next(error);
  }
});

export default router;
