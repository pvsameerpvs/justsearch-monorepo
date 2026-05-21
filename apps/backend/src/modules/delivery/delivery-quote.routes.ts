import { Router } from 'express';
import { z } from 'zod';
import { getDeliveryQuote } from '../../lib/delivery/delivery-quote.service';

const router = Router();

// POST /api/v1/delivery/quote
router.post('/quote', async (req, res, next) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ available: false, reason: 'Tenant context required' });
    }

    const schema = z.object({
      customerLat: z.number().min(-90).max(90),
      customerLng: z.number().min(-180).max(180),
    });

    const body = schema.parse(req.body);
    const quote = await getDeliveryQuote(req.tenant.id, body.customerLat, body.customerLng);
    res.json(quote);
  } catch (error) {
    next(error);
  }
});

export default router;
