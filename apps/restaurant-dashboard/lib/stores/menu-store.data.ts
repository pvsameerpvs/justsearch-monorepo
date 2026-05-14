import type { MenuCategory } from "./menu-store";

export const INITIAL: MenuCategory[] = [
  {
    id: '1',
    title: 'Small Plates',
    description: 'Perfect for sharing or a light start',
    emoji: '🥗',
    items: [
      { id: '1', name: 'Whipped Hummus', description: 'Crisp chickpeas, olive oil, warm pita', price: 28, currency: 'AED', image: 'https://images.unsplash.com/photo-1637949385162-e416fb15b2ce?auto=format&fit=crop&w=800&q=80', tags: ['Vegetarian', 'Popular'], isAvailable: true },
      { id: '2', name: 'Charred Halloumi', description: 'Citrus glaze, fresh mint, sesame crunch', price: 34, currency: 'AED', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80', tags: ['Chef Pick'], isAvailable: true },
    ],
  },
  {
    id: '2',
    title: 'Main Plates',
    description: 'Hearty signatures and grill favorites',
    emoji: '🍽️',
    items: [
      { id: '3', name: 'Citrus Grilled Salmon', description: 'Herb rice, lemon butter sauce, asparagus', price: 78, currency: 'AED', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80', tags: ['Healthy'], isAvailable: true },
      { id: '4', name: 'Slow-Roasted Lamb', description: 'Harissa rub, garlic potatoes, pickled onion', price: 95, currency: 'AED', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', tags: ['Popular', 'Signature'], isAvailable: true },
    ],
  },
  {
    id: '3',
    title: 'Desserts',
    description: 'Sweet finishes to your meal',
    emoji: '🍰',
    items: [
      { id: '5', name: 'Kunafa Cheesecake', description: 'Crispy kataifi crust, rosewater syrup', price: 42, currency: 'AED', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80', tags: ['Sweet'], isAvailable: true },
    ],
  },
];
