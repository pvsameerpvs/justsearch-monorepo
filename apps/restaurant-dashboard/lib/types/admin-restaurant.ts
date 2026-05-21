export type RestaurantStatus = 'active' | 'draft' | 'suspended';

export type SocialLink = {
  platform: string;
  url: string;
  handle: string;
};

import type { DeliveryConfig } from "@justsearch/types";

export type AdminRestaurant = {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  city: string;
  area: string;
  status: RestaurantStatus;
  createdAt: string;
  tables: number;
  ownerName: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  cuisine: string;
  taxNumber: string;
  businessLicense: string;
  licenseUrl: string;
  photos: string[];
  dashboardUsername: string;
  dashboardPassword: string;
  website: string;
  logoUrl: string;
  heroImageUrl: string;
  socials: SocialLink[];
  overallRating: number;
  totalReviews: number;
  isPureVeg: boolean;
  delivery?: DeliveryConfig;
};
