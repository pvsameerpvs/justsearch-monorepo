import { z } from 'zod';

export const createRestaurantSchema = z.object({
  slug: z.string().min(3).max(64),
  subdomain: z.string().min(3).max(64),
  name: z.string().min(1).max(255),
  ownerName: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  area: z.string().optional(),
  taxNumber: z.string().optional(),
  businessLicense: z.string().optional(),
  licenseUrl: z.string().optional(),
  photos: z.array(z.string()).optional(),
  cuisine: z.string().optional(),
  tables: z.coerce.number().optional(),
  dashboardUsername: z.string().optional(),
  dashboardPassword: z.string().optional(),
});

export const updateRestaurantSchema = z.object({
  name: z.string().min(1).optional(),
  status: z.enum(['draft', 'active', 'inactive', 'suspended']).optional(),
  ownerName: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional(),
  settings: z.record(z.unknown()).optional(),
});

export function buildSettings(body: z.infer<typeof createRestaurantSchema>) {
  return {
    ownerName: body.ownerName,
    contactPhone: body.contactPhone,
    contactEmail: body.contactEmail,
    address: body.address,
    city: body.city,
    area: body.area,
    taxNumber: body.taxNumber,
    businessLicense: body.businessLicense,
    licenseUrl: body.licenseUrl,
    photos: body.photos,
    cuisine: body.cuisine,
    tables: body.tables,
    dashboardUsername: body.dashboardUsername,
    dashboardPassword: body.dashboardPassword,
  };
}
