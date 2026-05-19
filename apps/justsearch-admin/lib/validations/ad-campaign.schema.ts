import { z } from 'zod';

export const adCampaignSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(100, 'Title too long'),
  clientName: z.string().min(2, 'Client name is required').max(100),
  companyName: z.string().min(2, 'Company name is required').max(100),
  mediaType: z.enum(['image', 'video', 'gif']),
  mediaUrl: z.string().min(1, 'Media file is required'),
  mediaUrlLow: z.string().optional().default(''),
  linkUrl: z.string().url('Must be a valid URL starting with https://').or(z.literal('')).optional().default(''),
  duration: z.coerce.number().min(5, 'Minimum 5 seconds').max(300, 'Maximum 300 seconds'),
  type: z.enum(['restaurant_brought', 'platform']),
  restaurantId: z.string().nullable(),
  restaurantName: z.string().nullable(),
  assignedGames: z.array(z.string()).min(1, 'Select at least one game'),
  isActive: z.boolean().optional(),
  category: z.string().max(50).optional().default(''),
  budget: z.coerce.number().min(0, 'Budget must be 0 or more'),
  costPerView3s: z.coerce.number().min(0, 'Cost per 3s view must be 0 or more').optional().default(0.30),
  costPerViewFull: z.coerce.number().min(0, 'Cost per full view must be 0 or more').optional().default(1.00),
  costPerClick: z.coerce.number().min(0, 'Cost per click must be 0 or more').optional().default(5.00),
  startDate: z.string().optional().default(''),
  endDate: z.string().optional().default(''),
  visibility: z.object({
    title: z.boolean(),
    description: z.boolean(),
    linkUrl: z.boolean(),
  }).optional().default({ title: true, description: false, linkUrl: true }),
}).refine(
  (data) => {
    if (data.type === 'restaurant_brought') {
      return !!data.restaurantId && data.restaurantId.length > 0;
    }
    return true;
  },
  {
    message: 'Restaurant is required for this campaign type',
    path: ['restaurantId'],
  }
);

export type AdCampaignSchema = z.infer<typeof adCampaignSchema>;
