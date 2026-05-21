import { z } from "zod";

export const restaurantSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
  ownerName: z.string().min(2, "Owner name is required"),
  contactPhone: z.string().min(5, "Valid phone number required"),
  contactEmail: z.string().email("Valid email required"),
  address: z.string().min(5, "Full address is required"),
  city: z.string().min(2, "City is required"),
  area: z.string().min(2, "Area is required"),
  taxNumber: z.string().min(3, "Tax number is required"),
  businessLicense: z.string().min(3, "Business license is required"),
  licenseUrl: z.string(),
  photos: z.array(z.string()).max(4, "Maximum 4 photos"),
  cuisine: z.string().min(2, "Cuisine type is required"),
  tables: z.coerce.number().min(1).max(500),
  dashboardUsername: z.string().min(3, "Username is required").optional(),
  dashboardPassword: z.string().min(6, "Password must be at least 6 characters").optional(),
  confirmPassword: z.string().min(6, "Confirm password is required").optional(),
}).refine((data) => {
  if (!data.dashboardPassword) return true;
  return data.dashboardPassword === data.confirmPassword;
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RestaurantFormData = z.infer<typeof restaurantSchema>;
