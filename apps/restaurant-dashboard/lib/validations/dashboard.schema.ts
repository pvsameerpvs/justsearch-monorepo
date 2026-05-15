import { z } from 'zod';

export const menuItemSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().max(200, 'Description too long').optional(),
  price: z.number().positive('Price must be positive'),
  categoryId: z.string().uuid('Select a category'),
  isAvailable: z.boolean().default(true),
  tags: z.array(z.string()).max(3, 'Maximum 3 tags'),
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().max(200).optional(),
  emoji: z.string().max(2).optional(),
  sortOrder: z.number().int().nonnegative(),
});

export const voucherSchema = z.object({
  code: z.string().min(4, 'Code must be at least 4 characters'),
  title: z.string().min(2, 'Title is required'),
  description: z.string().max(200).optional().default(''),
  type: z.enum(['fixed', 'percentage']),
  value: z.number().positive('Value must be positive'),
  minOrderValue: z.number().nonnegative().default(0),
  maxDiscount: z.number().nonnegative().default(0),
  usageLimit: z.number().int().nonnegative().default(100),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
});

export const deliveryAgentSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone is required'),
  vehicleType: z.enum(['bike', 'scooter', 'car']),
});

export const statusUpdateSchema = z.object({
  status: z.enum([
    'pending',
    'confirmed',
    'preparing',
    'ready',
    'out_for_delivery',
    'completed',
    'cancelled',
  ]),
});

export type MenuItemFormData = z.infer<typeof menuItemSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type VoucherFormData = z.infer<typeof voucherSchema>;
export type DeliveryAgentFormData = z.infer<typeof deliveryAgentSchema>;
export type StatusUpdateFormData = z.infer<typeof statusUpdateSchema>;
