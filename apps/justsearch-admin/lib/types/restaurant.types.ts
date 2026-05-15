export type RestaurantStatus = 'active' | 'draft' | 'suspended';

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
};
