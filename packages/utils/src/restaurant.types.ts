export type RestaurantTheme = {
  brandColor: string;
  brandSoft: string;
  accentColor: string;
  accentSoft: string;
  surface: string;
  ink: string;
  muted?: string;
  border?: string;
  pageBackgroundFrom?: string;
  pageBackgroundTo?: string;
  pageGlowBrand?: string;
  pageGlowAccent?: string;
  cardSurface?: string;
  cardSurfaceMuted?: string;
  cardBorder?: string;
  logoGradientFrom?: string;
  logoGradientTo?: string;
};

export type SocialLink = {
  platform: 'Instagram' | 'Facebook' | 'WhatsApp' | 'TikTok' | 'Twitter' | 'YouTube' | 'Snapchat';
  url: string;
  handle: string;
};

export type OpeningHour = {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
  isToday?: boolean;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  subcategory?: string;
  price: number;
  currency: string;
  image?: string;
  tags?: string[];
  isAvailable: boolean;
};

export type MenuCategory = {
  id: string;
  title: string;
  description: string;
  emoji?: string;
  items: MenuItem[];
};

export type GameType = 'local' | 'embed';
export type LocalGameFoodItem = 'burger' | 'pizza' | 'donut' | 'taco' | 'sushi';

type BaseGame = {
  id: string;
  name: string;
  description: string;
  icon: string;
  coverImageUrl?: string;
  prize: string;
  communityTopScore?: number;
  accessLevel: 'public' | 'login_required' | 'session_required';
  isAvailable: boolean;
  tag?: 'HOT' | 'TOP RATED' | 'NEW' | 'PRO';
};

export type LocalGame = BaseGame & {
  type: 'local';
  localGameId: string;
  playerFoodItem?: LocalGameFoodItem | 'random';
};

export type EmbedGame = BaseGame & {
  type: 'embed';
  embedUrl: string;
  embedProvider?: string;
};

export type Game = LocalGame | EmbedGame;

export type GoogleReview = {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
};

export type PartyPackage = {
  id: string;
  name: string;
  description: string;
  minGuests: number;
  maxGuests: number;
  pricePerHead?: number;
  flatPrice?: number;
  currency: string;
  includes: string[];
  badge?: string;
};

export type Restaurant = {
  id?: string;
  slug: string;
  subdomain: string;
  name: string;
  tagline: string;
  description: string;
  logoUrl?: string;
  heroImageUrl?: string;
  category: string;
  cuisine: string[];
  address: string;
  city: string;
  phone: string;
  email: string;
  website?: string;
  googleMapsUrl?: string;
  googlePlaceId?: string;
  overallRating: number;
  totalReviews: number;
  theme: RestaurantTheme;
  openingHours: OpeningHour[];
  socials: SocialLink[];
  menu: MenuCategory[];
  games: Game[];
  reviews: GoogleReview[];
  partyPackages: PartyPackage[];
};
