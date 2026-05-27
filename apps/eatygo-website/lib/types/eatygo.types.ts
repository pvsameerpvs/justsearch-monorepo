export interface NavLink {
  label: string;
  href: string;
}

export interface HeroMetric {
  label: string;
  value: string;
}

export interface Kitchen {
  id: string;
  name: string;
  cuisine: string;
  eta: string;
  rating: string;
  priceNote: string;
  imageSrc: string;
  imageAlt: string;
  featuredDish: string;
  badges: string[];
}

export interface OrderStep {
  id: string;
  label: string;
  title: string;
  detail: string;
}

export interface Highlight {
  label: string;
  value: string;
}

export type PlatformIcon = 'qr' | 'delivery' | 'game' | 'dashboard' | 'website' | 'admin';

export interface PlatformFeature {
  id: string;
  icon: PlatformIcon;
  title: string;
  detail: string;
}

export interface RestaurantBenefit {
  id: string;
  title: string;
  detail: string;
}
