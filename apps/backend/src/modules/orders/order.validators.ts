import { z } from 'zod';

export const createOrderSchema = z.object({
  customerName: z.string().min(1).max(255),
  customerPhone: z.string().min(8).max(20),
  fulfillmentType: z.enum(['dine_in', 'delivery', 'pickup']),
  source: z.enum(['public_qr', 'table_qr', 'direct_web', 'dashboard']).optional(),
  items: z.array(
    z.object({
      menuItemId: z.string().uuid(),
      name: z.string().min(1),
      quantity: z.number().int().min(1),
      price: z.number().positive(),
    })
  ).min(1),
  subtotal: z.number().nonnegative(),
  deliveryFee: z.number().nonnegative().default(0),
  tax: z.number().nonnegative().default(0),
  total: z.number().positive(),
  deliveryAddress: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  notes: z.string().max(1000).optional(),
  tableId: z.string().uuid().optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled']),
});
