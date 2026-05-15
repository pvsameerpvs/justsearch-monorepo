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
  hours: string;
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

export const mockRestaurants: Record<string, Restaurant> = {
  'mosaic-table': {
    slug: 'mosaic-table',
    subdomain: 'mosaic-table',
    name: 'Mosaic Table',
    tagline: 'Where every meal becomes a memory.',
    description:
      'A modern Mediterranean restaurant in the heart of Dubai, loved for bold flavors, warm hospitality, and unforgettable moments around the table.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
    category: 'Fine Dining',
    cuisine: ['Mediterranean', 'Middle Eastern', 'Modern European'],
    address: '24 Marina Walk, Jumeirah Lake Towers',
    city: 'Dubai, UAE',
    phone: '+971 4 555 0188',
    email: 'hello@mosaictable.com',
    website: 'https://mosaictable.com',
    googleMapsUrl: 'https://maps.google.com',
    googlePlaceId: 'ChIJxx_mosaic_mock',
    overallRating: 4.7,
    totalReviews: 312,
    theme: {
      brandColor: '15 118 110',
      brandSoft: '223 247 243',
      accentColor: '245 170 66',
      accentSoft: '255 238 209',
      surface: '255 255 255',
      ink: '15 23 42',
      muted: '94 108 132',
      border: '226 232 240',
      pageBackgroundFrom: '248 243 234',
      pageBackgroundTo: '244 239 230',
      pageGlowBrand: '15 118 110',
      pageGlowAccent: '245 170 66',
      cardSurface: '255 255 255',
      cardSurfaceMuted: '248 250 252',
      cardBorder: '255 255 255',
      logoGradientFrom: '15 118 110',
      logoGradientTo: '245 170 66',
    },
    openingHours: [
      { day: 'Mon – Thu', hours: '10:00 – 23:00' },
      { day: 'Friday', hours: '10:00 – 00:00' },
      { day: 'Sat – Sun', hours: '09:00 – 00:00', isToday: true },
    ],
    socials: [
      { platform: 'Instagram', url: 'https://instagram.com/mosaictable', handle: '@mosaictable' },
      { platform: 'Facebook', url: 'https://facebook.com/mosaictable', handle: 'Mosaic Table' },
      { platform: 'WhatsApp', url: 'https://wa.me/97145550188', handle: '+971 4 555 0188' },
      { platform: 'TikTok', url: 'https://tiktok.com/@mosaictable', handle: '@mosaictable' },
    ],
    menu: [
      {
        id: 'small-plates',
        title: 'Small Plates',
        description: 'Shareable starters and bright opening bites',
        emoji: '🥗',
        items: [
          {
            id: 'hummus',
            name: 'Whipped Hummus',
            description: 'Crisp chickpeas, extra virgin olive oil, warm pita chips',
            subcategory: 'Cold Selection',
            price: 28,
            currency: 'AED',
            image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
            tags: ['Veg'],
            isAvailable: true,
          },
          {
            id: 'halloumi',
            name: 'Charred Halloumi',
            description: 'Citrus glaze, fresh mint, sesame & herbs',
            subcategory: 'Warm Bites',
            price: 34,
            currency: 'AED',
            image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
            tags: ['Popular', 'Veg'],
            isAvailable: true,
          },
          {
            id: 'fattoush',
            name: 'Crispy Fattoush',
            description: 'Romaine, sumac tomatoes, cucumber, pomegranate',
            subcategory: 'Cold Selection',
            price: 26,
            currency: 'AED',
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
            tags: ['Veg', 'Light'],
            isAvailable: true,
          },
        ],
      },
      {
        id: 'main-plates',
        title: 'Main Plates',
        description: 'Seasonal dishes built for lingering conversations',
        emoji: '🍽️',
        items: [
          {
            id: 'salmon',
            name: 'Citrus Grilled Salmon',
            description: 'Herb rice, roasted greens, lemon butter sauce',
            subcategory: 'Signature Mains',
            price: 78,
            currency: 'AED',
            image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80',
            isAvailable: true,
          },
          {
            id: 'chicken-bowl',
            name: 'Roasted Chicken Skewer Bowl',
            description: 'Tahini rice, pickles, and blistered tomatoes',
            subcategory: 'Signature Mains',
            price: 64,
            currency: 'AED',
            image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80',
            tags: ["Chef's Pick"],
            isAvailable: true,
          },
          {
            id: 'lamb-rack',
            name: 'Slow-Cooked Lamb Rack',
            description: "Za'atar crust, roasted root vegetables, jus",
            subcategory: "Chef's Reserve",
            price: 110,
            currency: 'AED',
            image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1200&q=80',
            tags: ['Premium'],
            isAvailable: true,
          },
        ],
      },
      {
        id: 'desserts',
        title: 'Desserts',
        description: 'The part everyone remembers after the bill',
        emoji: '🍮',
        items: [
          {
            id: 'date-cake',
            name: 'Date Cake',
            description: 'Warm caramel, candied pistachio, and cream',
            subcategory: 'Sweet Finale',
            price: 32,
            currency: 'AED',
            image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=80',
            isAvailable: true,
          },
          {
            id: 'panna-cotta',
            name: 'Cardamom Panna Cotta',
            description: 'Orange zest, honey, and toasted crumble',
            subcategory: 'Sweet Finale',
            price: 29,
            currency: 'AED',
            image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80',
            isAvailable: true,
          },
        ],
      },
      {
        id: 'drinks',
        title: 'Drinks',
        description: 'Sips to start, pair, or finish',
        emoji: '🍹',
        items: [
          {
            id: 'saffron-spritz',
            name: 'Saffron Spritz',
            description: 'A bright, floral refresher with a hint of saffron',
            subcategory: 'Signature Cocktails',
            price: 38,
            currency: 'AED',
            image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80',
            tags: ['New', 'Popular'],
            isAvailable: true,
          },
          {
            id: 'cold-brew',
            name: 'Cold Brew Tonic',
            description: 'Long, crisp, and quietly energizing',
            subcategory: 'Coffee & Tonic',
            price: 22,
            currency: 'AED',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
            isAvailable: true,
          },
        ],
      },
    ],
    games: [
      {
        id: 'vex-runner',
        name: 'Jump & Bite',
        description: 'Dash, jump, and dodge obstacles with food runners in this arcade challenge.',
        type: 'local',
        localGameId: 'vex-runner',
        playerFoodItem: 'random',
        icon: '🏃',
        coverImageUrl: '/games/jump&bite.png',
        prize: 'Up to 1200 points',
        communityTopScore: 12730,
        accessLevel: 'public',
        isAvailable: true,
        tag: 'HOT',
      },
      {
        id: 'hungry-bird-rush',
        name: 'Hungry Bird Rush',
        description: 'Tap to fly, weave through pipes, and stack points in this arcade challenge.',
        type: 'local',
        localGameId: 'hungry-bird-rush',
        icon: '🐤',
        coverImageUrl: '/games/hungry-bird-rush-model.png',
        prize: 'Up to 700 points',
        communityTopScore: 4320,
        accessLevel: 'public',
        isAvailable: true,
        tag: 'NEW',
      },
      {
        id: 'cheese-chase',
        name: 'Cheddar Chase',
        description: 'Guide the mouse through 50 increasingly complex mazes to reach the cheese.',
        type: 'local',
        localGameId: 'cheese-chase',
        icon: '🧀',
        coverImageUrl: '/games/cheddar-chase.png',
        prize: 'Up to 2500 points',
        communityTopScore: 0,
        accessLevel: 'public',
        isAvailable: true,
        tag: 'PRO',
      },
      {
        id: 'memory-match',
        name: 'Gem Match',
        description: 'Classic card matching game. Test your memory by finding all pairs of gems in the fewest moves.',
        type: 'local',
        localGameId: 'memory-match',
        icon: '🃏',
        coverImageUrl: '/games/gem-match.png',
        prize: 'Up to 2000 points',
        communityTopScore: 0,
        accessLevel: 'public',
        isAvailable: true,
        tag: 'HOT',
      },
      {
        id: 'slice-master',
        name: 'Slice Master',
        description: 'Swipe to slice flying fruits and food! Watch out for bombs. Build combos for massive points.',
        type: 'local',
        localGameId: 'slice-master',
        playerFoodItem: 'random',
        icon: '🍕',
        coverImageUrl: '/games/slice-master.png',
        prize: 'Up to 600 points',
        communityTopScore: 0,
        accessLevel: 'public',
        isAvailable: true,
        tag: 'NEW',
      },
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Amina Hassan',
        rating: 5,
        text: 'Absolutely stunning experience — the food, the ambience, the staff. 10/10 will be back for our anniversary.',
        date: '2 days ago',
        verified: true,
      },
      {
        id: 'r2',
        author: 'Khalid Al Mansoori',
        rating: 5,
        text: 'The slow-cooked lamb rack was incredible. Best Mediterranean food in JLT without question.',
        date: '1 week ago',
        verified: true,
      },
      {
        id: 'r3',
        author: 'Priya Nair',
        rating: 4,
        text: 'Great atmosphere, friendly staff, food was delicious. The hummus and charred halloumi are must-tries.',
        date: '2 weeks ago',
        verified: true,
      },
      {
        id: 'r4',
        author: 'James Thornton',
        rating: 5,
        text: 'Mosaic Table is our go-to for business dinners. Consistently excellent quality every time.',
        date: '3 weeks ago',
        verified: false,
      },
      {
        id: 'r5',
        author: 'Sara Al Farsi',
        rating: 4,
        text: 'Loved the saffron spritz and the panna cotta. Parking can be tricky but totally worth it!',
        date: '1 month ago',
        verified: true,
      },
      {
        id: 'r6',
        author: 'Marco Rossi',
        rating: 5,
        text: 'The QR loyalty thing is brilliant — earned enough points for a free dessert on my third visit!',
        date: '1 month ago',
        verified: true,
      },
    ],
    partyPackages: [
      {
        id: 'celebrations',
        name: 'Celebrations Package',
        description: 'Perfect for birthdays, anniversaries, and milestone moments',
        minGuests: 10,
        maxGuests: 30,
        pricePerHead: 150,
        currency: 'AED',
        includes: [
          '3-course set menu',
          'Welcome mocktail',
          'Birthday / anniversary cake',
          'Dedicated host',
          'Custom table decoration',
          'Priority reservation',
        ],
        badge: 'Most Popular',
      },
      {
        id: 'corporate',
        name: 'Corporate Dining',
        description: 'Impress your clients with a premium private dining setup',
        minGuests: 15,
        maxGuests: 60,
        pricePerHead: 200,
        currency: 'AED',
        includes: [
          '4-course set menu',
          'Branded menu cards',
          'A/V screen and projector',
          'Dedicated events manager',
          'Welcome drinks',
          'Complimentary valet parking',
        ],
        badge: 'Business',
      },
      {
        id: 'large-gatherings',
        name: 'Full Venue Buyout',
        description: 'Take over the entire restaurant for your mega event',
        minGuests: 80,
        maxGuests: 200,
        flatPrice: 25000,
        currency: 'AED',
        includes: [
          'Full restaurant exclusive access',
          'Custom menu planning with Executive Chef',
          'Live entertainment setup',
          'Premium beverage package',
          'Valet parking for all guests',
          'Dedicated photography hour',
        ],
        badge: 'Premium',
      },
    ],
  },
  'spice-garden': {
    slug: 'spice-garden',
    subdomain: 'spice-garden',
    name: 'Spice Garden',
    tagline: 'Authentic Indian flavors, modern Dubai setting.',
    description: 'A vibrant Indian restaurant serving timeless classics with a contemporary twist.',
    heroImageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80',
    category: 'Casual Dining',
    cuisine: ['Indian', 'South Asian', 'Fusion'],
    address: 'Downtown Dubai, Sheikh Mohammed bin Rashid Blvd',
    city: 'Dubai, UAE',
    phone: '+971 4 333 4455',
    email: 'hello@spicegarden.com',
    overallRating: 4.5,
    totalReviews: 189,
    theme: {
      brandColor: '180 83 9',
      brandSoft: '254 243 199',
      accentColor: '220 38 38',
      accentSoft: '254 226 226',
      surface: '255 255 255',
      ink: '15 23 42',
      muted: '94 108 132',
      border: '226 232 240',
      pageBackgroundFrom: '255 248 240',
      pageBackgroundTo: '255 244 235',
      pageGlowBrand: '180 83 9',
      pageGlowAccent: '220 38 38',
      cardSurface: '255 255 255',
      cardSurfaceMuted: '248 250 252',
      cardBorder: '255 255 255',
      logoGradientFrom: '180 83 9',
      logoGradientTo: '220 38 38',
    },
    openingHours: [
      { day: 'Mon – Thu', hours: '11:00 – 22:00' },
      { day: 'Friday', hours: '12:00 – 23:00' },
      { day: 'Sat – Sun', hours: '11:00 – 23:00', isToday: true },
    ],
    socials: [
      { platform: 'Instagram', url: 'https://instagram.com/spicegarden', handle: '@spicegarden' },
      { platform: 'Facebook', url: 'https://facebook.com/spicegarden', handle: 'Spice Garden' },
    ],
    menu: [
      {
        id: 'starters',
        title: 'Starters',
        description: 'Bold flavors to begin your journey',
        emoji: '🥘',
        items: [
          {
            id: 'samosa',
            name: 'Crispy Samosas',
            description: 'Golden pastry with spiced potato filling, tamarind chutney',
            price: 18,
            currency: 'AED',
            tags: ['Veg', 'Popular'],
            isAvailable: true,
          },
          {
            id: 'paneer-tikka',
            name: 'Paneer Tikka',
            description: 'Marinated cottage cheese, charred to perfection',
            price: 32,
            currency: 'AED',
            tags: ['Veg'],
            isAvailable: true,
          },
        ],
      },
      {
        id: 'curries',
        title: 'Curries',
        description: 'Rich, aromatic gravies',
        emoji: '🍛',
        items: [
          {
            id: 'butter-chicken',
            name: 'Butter Chicken',
            description: 'Tandoori chicken in rich tomato-butter gravy',
            price: 58,
            currency: 'AED',
            tags: ['Popular', "Chef's Pick"],
            isAvailable: true,
          },
          {
            id: 'dal-makhani',
            name: 'Dal Makhani',
            description: 'Creamy black lentils slow-cooked overnight',
            price: 38,
            currency: 'AED',
            tags: ['Veg'],
            isAvailable: true,
          },
        ],
      },
    ],
    games: [
      {
        id: 'vex-runner',
        name: 'Jump & Bite',
        description: 'Dash, jump, and dodge obstacles with food runners in this arcade challenge.',
        type: 'local',
        localGameId: 'vex-runner',
        playerFoodItem: 'random',
        icon: '🏃',
        coverImageUrl: '/games/jump&bite.png',
        prize: 'Up to 1200 points',
        communityTopScore: 12730,
        accessLevel: 'public',
        isAvailable: true,
        tag: 'HOT',
      },
    ],
    reviews: [
      {
        id: 'sg1',
        author: 'Priya Sharma',
        rating: 5,
        text: 'The butter chicken here is absolutely divine. Best in Dubai!',
        date: '3 days ago',
        verified: true,
      },
    ],
    partyPackages: [],
  },
};

export function getRestaurantBySlug(slug: string): Restaurant | null {
  return mockRestaurants[slug] ?? null;
}

export function getAllRestaurantSlugs(): string[] {
  return Object.keys(mockRestaurants);
}

export function getRestaurantInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function getFallbackRestaurant(): Restaurant {
  return mockRestaurants['mosaic-table'];
}

export function getRestaurantDomain(subdomain: string, baseDomain: string = 'js-restorant.com'): string {
  return `${subdomain}.${baseDomain}`;
}

export function getRestaurantMenuDomain(subdomain: string, baseDomain: string = 'js-restorant.com'): string {
  return `${subdomain}-menu.${baseDomain}`;
}

export function getRestaurantDashboardDomain(subdomain: string, baseDomain: string = 'js-restorant.com'): string {
  return `admin-${subdomain}.${baseDomain}`;
}

export function getDeliveryPortalDomain(subdomain: string, agentId: string, baseDomain: string = 'js-restorant.com'): string {
  return `${subdomain}-${agentId}.${baseDomain}`;
}

// ─── Mutable Operations (Demo Only) ───

export function updateRestaurant(slug: string, updates: Partial<Restaurant>): Restaurant | null {
  const existing = mockRestaurants[slug];
  if (!existing) return null;
  const updated = { ...existing, ...updates };
  mockRestaurants[slug] = updated;
  return updated;
}

export function addRestaurant(restaurant: Restaurant): boolean {
  if (mockRestaurants[restaurant.slug]) return false;
  mockRestaurants[restaurant.slug] = restaurant;
  return true;
}

export function removeRestaurant(slug: string): boolean {
  if (!mockRestaurants[slug]) return false;
  delete mockRestaurants[slug];
  return true;
}
