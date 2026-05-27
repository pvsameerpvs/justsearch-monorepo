import type {
  HeroMetric,
  Highlight,
  Kitchen,
  NavLink,
  OrderStep,
  PlatformFeature,
  RestaurantBenefit,
} from '@/lib/types/eatygo.types';

export const NAV_LINKS: NavLink[] = [
  { label: 'Platform', href: '/platform' },
  { label: 'Restaurants', href: '/restaurants' },
  { label: 'Games', href: '/games' },
  { label: 'Register', href: '/register' },
];

export const SEARCH_TAGS = ['Your own link', 'Table QR', 'Delivery app', 'Dashboard', 'Games & Loyalty'];

export const HERO_METRICS: HeroMetric[] = [
  { label: 'Your own link', value: 'Branded URL' },
  { label: 'Table ordering', value: 'QR code' },
  { label: 'Delivery', value: 'Rider app' },
  { label: 'Operations', value: 'Dashboard' },
];

export const KITCHENS: Kitchen[] = [
  {
    id: 'miso-market',
    name: 'Miso Market',
    cuisine: 'Sushi bowls',
    eta: '18-24 min',
    rating: '4.9',
    priceNote: 'Fresh bowls from AED 44',
    imageSrc: '/images/eatygo-sushi-bowl.png',
    imageAlt: 'A premium sushi rice bowl with salmon and avocado',
    featuredDish: 'Salmon yuzu bowl',
    badges: ['Top rated', 'Fast'],
  },
  {
    id: 'ember-bun',
    name: 'Ember Bun',
    cuisine: 'Craft burgers',
    eta: '22-30 min',
    rating: '4.8',
    priceNote: 'Chef burgers from AED 37',
    imageSrc: '/images/eatygo-burger.png',
    imageAlt: 'An artisan burger with golden fries',
    featuredDish: 'Smoked cheddar stack',
    badges: ['Popular', 'New'],
  },
  {
    id: 'verde-table',
    name: 'Verde Table',
    cuisine: 'Pasta and brunch',
    eta: '20-28 min',
    rating: '4.9',
    priceNote: 'Seasonal plates from AED 40',
    imageSrc: '/images/eatygo-brunch-pasta.png',
    imageAlt: 'A bright brunch and pasta table spread',
    featuredDish: 'Burrata garden pasta',
    badges: ['Fresh', 'Family'],
  },
  {
    id: 'saffron-lane',
    name: 'Saffron Lane',
    cuisine: 'Indian grills',
    eta: '25-34 min',
    rating: '4.8',
    priceNote: 'Grill plates from AED 48',
    imageSrc: '/images/eatygo-brunch-pasta.png',
    imageAlt: 'A bright restaurant table with fresh plated dishes',
    featuredDish: 'Tandoor herb platter',
    badges: ['Dinner', 'Rewards'],
  },
  {
    id: 'noor-cafe',
    name: 'Noor Cafe',
    cuisine: 'Cafe and desserts',
    eta: '15-22 min',
    rating: '4.7',
    priceNote: 'Cafe sets from AED 29',
    imageSrc: '/images/eatygo-sushi-bowl.png',
    imageAlt: 'A refined restaurant bowl with colorful ingredients',
    featuredDish: 'Pistachio cream toast',
    badges: ['Cafe', 'QR tables'],
  },
  {
    id: 'coastal-bite',
    name: 'Coastal Bite',
    cuisine: 'Seafood plates',
    eta: '28-36 min',
    rating: '4.9',
    priceNote: 'Seafood from AED 55',
    imageSrc: '/images/eatygo-burger.png',
    imageAlt: 'A premium casual restaurant dish with sides',
    featuredDish: 'Citrus prawn plate',
    badges: ['Premium', 'Delivery'],
  },
];

export const ORDER_STEPS: OrderStep[] = [
  {
    id: 'taste',
    label: '01',
    title: 'Choose your mood',
    detail: 'Browse nearby kitchens by dish, time, rating, or comfort level.',
  },
  {
    id: 'kitchen',
    label: '02',
    title: 'Follow the kitchen',
    detail: 'See prep progress, rider handoff, and arrival timing in one calm view.',
  },
  {
    id: 'table',
    label: '03',
    title: 'Eat beautifully',
    detail: 'Save favorite meals, reorder quickly, and collect tasteful rewards.',
  },
];

export const ORDER_HIGHLIGHTS: Highlight[] = [
  { label: 'Ready', value: '12:42' },
  { label: 'Rider', value: 'Nadia' },
  { label: 'Reward', value: '+80 pts' },
];

export const PLATFORM_FEATURES: PlatformFeature[] = [
  {
    id: 'customer-site',
    icon: 'website',
    title: 'Your own restaurant link',
    detail: 'Get your branded website like hotgrill.eatygo.com for menu discovery, ordering, and loyalty.',
  },
  {
    id: 'table-qr',
    icon: 'qr',
    title: 'Your own QR codes',
    detail: 'Every table gets its own QR code for dine-in menus, ordering, games, and rewards.',
  },
  {
    id: 'delivery-app',
    icon: 'delivery',
    title: 'Your own delivery app',
    detail: 'Connect orders to riders with pickup, live ETA, cash collection, and customer tracking.',
  },
  {
    id: 'dashboard',
    icon: 'dashboard',
    title: 'Your own dashboard',
    detail: 'Manage menus, QR codes, orders, staff, vouchers, customers, and daily activity in one place.',
  },
  {
    id: 'eat-play',
    icon: 'game',
    title: 'Eat & Play games',
    detail: 'Let customers play branded scratch games, win points, and return for rewards after ordering.',
  },
  {
    id: 'admin-control',
    icon: 'admin',
    title: 'Platform admin control',
    detail: 'Promote popular restaurants, review activity, manage onboarding, and monitor performance.',
  },
];

export const RESTAURANT_BENEFITS: RestaurantBenefit[] = [
  {
    id: 'own-link',
    title: 'Your own branded link',
    detail: 'Get a custom URL like yourname.eatygo.com that customers can visit directly for your full menu and ordering.',
  },
  {
    id: 'simple-qr',
    title: 'QR codes for every table',
    detail: 'Customers scan, browse the menu, place orders, and collect points without waiting for staff.',
  },
  {
    id: 'delivery',
    title: 'Your own delivery system',
    detail: 'Receive delivery orders, assign riders, track in real-time, and collect cash — all in your branded flow.',
  },
  {
    id: 'dashboard',
    title: 'Full operations dashboard',
    detail: 'Manage menus, QR codes, live orders, staff, vouchers, customer lists, and analytics in one dashboard.',
  },
];
