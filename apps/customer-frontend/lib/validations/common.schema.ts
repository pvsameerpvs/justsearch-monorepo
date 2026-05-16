import { z } from 'zod';

export const otpRequestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  mobile: z.string().min(10, 'Mobile must be at least 10 digits'),
});

export const otpVerifySchema = z.object({
  requestId: z.string().uuid(),
  otp: z.string().length(4, 'OTP must be 4 digits'),
});

export const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  type: z.enum(['staff', 'delivery', 'super_admin']).default('staff'),
});

export const addressSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  street: z.string().min(3, 'Street is required'),
  city: z.string().min(2, 'City is required'),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const checkoutAddressSchema = z.object({
  label: z.enum(['Home', 'Work', 'Other']),
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters'),
  details: z.string().optional(),
  alternateNumber: z
    .string()
    .regex(/^\+?\d{0,15}$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
});

export type CheckoutAddressFormData = z.infer<typeof checkoutAddressSchema>;

export const checkoutValidationSchema = z.object({
  address: z.string().min(5, 'Delivery address is required'),
  customerName: z.string().min(2, 'Name is required'),
  customerPhone: z.string().min(10, 'Valid phone is required'),
  paymentMethod: z.enum(['cash', 'card']),
});

export type CheckoutValidationFormData = z.infer<typeof checkoutValidationSchema>;

export const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerPhone: z.string().min(10, 'Valid phone is required'),
  fulfillmentType: z.enum(['dine_in', 'delivery', 'pickup']),
  deliveryAddress: checkoutAddressSchema,
  notes: z.string().max(200, 'Notes too long').optional(),
  paymentMethod: z.enum(['cash', 'card']).optional(),
});

export type OtpRequestFormData = z.infer<typeof otpRequestSchema>;
export type OtpVerifyFormData = z.infer<typeof otpVerifySchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
