import type { DeliveryOrder, DeliveryPortalSnapshot } from './delivery-types';

function buildItems(...items: { name: string; qty: number; price: number }[]): { items: DeliveryOrder['orderItems']; subtotal: number } {
  const currency = 'AED';
  const orderItems = items.map((i) => ({ name: i.name, quantity: i.qty, price: i.price, currency }));
  const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  return { items: orderItems, subtotal };
}

function buildOrder(
  id: string,
  code: string,
  customerName: string,
  customerPhone: string,
  neighborhood: string,
  dropoffAddress: string,
  lat: number,
  lng: number,
  orderedAtLabel: string,
  etaMinutes: number,
  paymentMode: 'prepaid' | 'cash_on_delivery',
  status: DeliveryOrder['status'],
  priority: 'standard' | 'rush',
  notes: string | undefined,
  ...items: { name: string; qty: number; price: number }[]
): DeliveryOrder {
  const { items: orderItems, subtotal } = buildItems(...items);
  const deliveryFee = subtotal > 50 ? 0 : 7;
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;
  return {
    id,
    code,
    customerName,
    customerPhone,
    neighborhood,
    dropoffAddress,
    latitude: lat,
    longitude: lng,
    orderedAtLabel,
    etaMinutes,
    itemCount: orderItems.reduce((sum, i) => sum + i.quantity, 0),
    orderValue: `AED ${total}`,
    orderItems,
    subtotal,
    deliveryFee,
    tax,
    total,
    paymentMode,
    status,
    priority,
    notes,
  };
}

const deliveryPortalSnapshots: Record<string, DeliveryPortalSnapshot> = {
  'mosaic-table': {
    restaurant: {
      slug: 'mosaic-table',
      name: 'Mosaic Table',
      deliveryDomain: 'mosaic-table-delivery.mydomain.com',
      zoneLabel: 'Downtown Marina and Trade Centre',
      supportPhone: '+971 50 890 2211',
    },
    agent: {
      id: 'agent-samira',
      name: 'Samira Khan',
      phone: '+971 52 880 4412',
      vehicleType: 'Scooter',
      shiftLabel: '12:00 PM to 8:00 PM',
      status: 'online',
      rating: 4.9,
      completedToday: 14,
    },
    metrics: [
      {
        label: 'Assigned now',
        value: '04',
        hint: 'Four active customer handoffs on the current route.',
        tone: 'warning',
      },
      {
        label: 'Avg route time',
        value: '19 min',
        hint: 'Healthy average for the lunch-to-evening delivery window.',
        tone: 'success',
      },
      {
        label: 'On-time rate',
        value: '96%',
        hint: 'Based on the most recent 50 completed deliveries.',
        tone: 'success',
      },
      {
        label: 'Pending handoff cash',
        value: 'AED 128',
        hint: 'Cash still expected from active cash-on-delivery stops.',
        tone: 'default',
      },
    ],
    activeOrders: [
      buildOrder(
        'ord-1042', 'JS-1042', 'Rana Elmi', '+971 55 112 3344', 'Dubai Marina',
        'Marina Heights Tower, Lobby B, Apartment 1604',
        25.2048, 55.2708,
        '12 minutes ago', 11, 'prepaid', 'on_route', 'rush',
        'Call at the lobby. Customer asked for extra napkins in the bag.',
        { name: 'Whipped Hummus', qty: 1, price: 28 },
        { name: 'Lamb Kofta Bowl', qty: 1, price: 55 },
        { name: 'Fattoush Salad', qty: 1, price: 32 },
        { name: 'Kunafa Ice Cream', qty: 1, price: 18 },
      ),
      buildOrder(
        'ord-1039', 'JS-1039', 'Yousef Rahman', '+971 56 778 9900', 'Trade Centre',
        'Liberty House, Office 1206, Sheikh Zayed Road',
        25.2285, 55.3270,
        '18 minutes ago', 16, 'cash_on_delivery', 'picked_up', 'standard',
        'Collect exact cash if possible. Reception will guide to the office tower.',
        { name: 'Chicken Shawarma Wrap', qty: 2, price: 22 },
      ),
      buildOrder(
        'ord-1037', 'JS-1037', 'Aaliyah Noor', '+971 50 334 5566', 'Jumeirah Garden City',
        'Wasl Vita, Building 3, Villa Gate 7',
        25.2034, 55.2603,
        '26 minutes ago', 21, 'prepaid', 'assigned', 'standard',
        undefined,
        { name: 'Mezze Platter', qty: 1, price: 65 },
        { name: 'Grilled Halloumi', qty: 1, price: 38 },
        { name: 'Pomegranate Juice', qty: 2, price: 22 },
        { name: 'Baklava Box', qty: 1, price: 24 },
      ),
      buildOrder(
        'ord-1034', 'JS-1034', 'Daniel George', '+971 54 667 8899', 'Satwa',
        'Al Diyafah Street, Building 28, Flat 203',
        25.2428, 55.2645,
        '31 minutes ago', 9, 'cash_on_delivery', 'arrived', 'rush',
        'Customer prefers contactless handoff at the apartment door.',
        { name: 'Falafel Wrap', qty: 2, price: 18 },
        { name: 'Mint Lemonade', qty: 1, price: 16 },
      ),
    ],
    completedOrders: [
      buildOrder(
        'ord-1028', 'JS-1028', 'Fatima Kareem', '+971 55 443 2211', 'Business Bay',
        'Executive Tower B, Floor 9',
        25.1864, 55.2671,
        '48 minutes ago', 0, 'prepaid', 'delivered', 'standard',
        undefined,
        { name: 'Shakshuka', qty: 1, price: 42 },
        { name: 'Saj Bread', qty: 1, price: 12 },
        { name: 'Turkish Coffee', qty: 1, price: 14 },
      ),
      buildOrder(
        'ord-1024', 'JS-1024', 'Leo Martin', '+971 56 554 3322', 'Al Safa',
        'Safa One Residences, Podium Entrance',
        25.1789, 55.2256,
        '1 hour ago', 0, 'cash_on_delivery', 'delivered', 'standard',
        undefined,
        { name: 'Beef Kebab Plate', qty: 1, price: 48 },
        { name: 'Rice Pilaf', qty: 1, price: 20 },
      ),
    ],
    routeChecklist: [
      'Confirm every order has sealed packaging before pickup.',
      'Batch the Marina and Trade Centre stops into one route when traffic is stable.',
      'Call customers only after arriving near the building to reduce missed handoffs.',
    ],
    routeHealthLabel: 'Route health is stable with moderate traffic near Sheikh Zayed Road.',
    supportNotice:
      'The Marina cluster is moving slightly slower than forecast. Keep rush orders first and call dispatch if the route exceeds 25 minutes.',
  },
  'spice-route': {
    restaurant: {
      slug: 'spice-route',
      name: 'Spice Route Kitchen',
      deliveryDomain: 'spice-route-delivery.mydomain.com',
      zoneLabel: 'Bur Dubai and Karama',
      supportPhone: '+971 50 770 9920',
    },
    agent: {
      id: 'agent-aarav',
      name: 'Aarav Menon',
      phone: '+971 55 002 1144',
      vehicleType: 'Bike',
      shiftLabel: '2:00 PM to 10:00 PM',
      status: 'busy',
      rating: 4.8,
      completedToday: 11,
    },
    metrics: [
      {
        label: 'Assigned now',
        value: '03',
        hint: 'Current queue sized for one active courier.',
        tone: 'warning',
      },
      {
        label: 'Avg route time',
        value: '22 min',
        hint: 'Slightly elevated because of Karama evening traffic.',
        tone: 'default',
      },
      {
        label: 'On-time rate',
        value: '92%',
        hint: 'Still within target, but dispatch should watch rush orders closely.',
        tone: 'warning',
      },
      {
        label: 'Pending handoff cash',
        value: 'AED 84',
        hint: 'Two cash stops remain in the active route.',
        tone: 'default',
      },
    ],
    activeOrders: [
      buildOrder(
        'ord-774', 'JS-774', 'Imran Habib', '+971 50 998 7766', 'Karama',
        'Karama Center, Back Entrance, Shop 14',
        25.2454, 55.3047,
        '9 minutes ago', 14, 'cash_on_delivery', 'picked_up', 'rush',
        undefined,
        { name: 'Butter Chicken', qty: 1, price: 38 },
        { name: 'Garlic Naan', qty: 2, price: 8 },
      ),
      buildOrder(
        'ord-770', 'JS-770', 'Sara Ahmed', '+971 55 667 3344', 'Bur Dubai',
        'Meena Bazaar, Building 6, Flat 802',
        25.2588, 55.2956,
        '16 minutes ago', 19, 'prepaid', 'assigned', 'standard',
        undefined,
        { name: 'Paneer Tikka', qty: 1, price: 42 },
        { name: 'Dal Makhani', qty: 1, price: 28 },
        { name: 'Jeera Rice', qty: 2, price: 14 },
        { name: 'Mango Lassi', qty: 2, price: 16 },
        { name: 'Gulab Jamun', qty: 1, price: 18 },
      ),
      buildOrder(
        'ord-768', 'JS-768', 'Harish Patel', '+971 56 223 4455', 'Oud Metha',
        'Healthcare City Residences, Tower B',
        25.2402, 55.3165,
        '28 minutes ago', 8, 'prepaid', 'arrived', 'rush',
        undefined,
        { name: 'Masala Dosa', qty: 1, price: 26 },
        { name: 'Idli Sambar', qty: 1, price: 18 },
        { name: 'Filter Coffee', qty: 1, price: 12 },
      ),
    ],
    completedOrders: [
      buildOrder(
        'ord-760', 'JS-760', 'Mariam Yusuf', '+971 54 334 5566', 'Al Mankhool',
        'Golden Sands, Building 7',
        25.2471, 55.2906,
        '43 minutes ago', 0, 'prepaid', 'delivered', 'standard',
        undefined,
        { name: 'Chicken Biryani', qty: 1, price: 45 },
        { name: 'Raita', qty: 1, price: 8 },
        { name: 'Papad', qty: 2, price: 6 },
        { name: 'Rose Milk', qty: 1, price: 14 },
      ),
      buildOrder(
        'ord-754', 'JS-754', 'Rohit Das', '+971 50 778 9900', 'Karama',
        'Near Lulu Hypermarket, Street 17',
        25.2460, 55.3030,
        '58 minutes ago', 0, 'cash_on_delivery', 'delivered', 'standard',
        undefined,
        { name: 'Egg Roll', qty: 1, price: 18 },
      ),
    ],
    routeChecklist: [
      'Confirm cash-on-delivery amount before leaving the restaurant.',
      'Use the Karama side streets to avoid the main market traffic buildup.',
      'Escalate to dispatch if arrival waits exceed five minutes.',
    ],
    routeHealthLabel: 'Route health is busy near Karama with mild congestion around market streets.',
    supportNotice:
      'Expect short traffic spikes during market pickup windows. Use rush stop sequencing and confirm drop-off landmarks before departure.',
  },
};

const FALLBACK_RESTAURANT_SLUG = 'mosaic-table';

export function getDeliveryPortalSnapshotBySlug(slug: string): DeliveryPortalSnapshot {
  return (
    deliveryPortalSnapshots[slug] ??
    deliveryPortalSnapshots[FALLBACK_RESTAURANT_SLUG]
  );
}

export function getDeliveryOrderById(
  slug: string,
  orderId: string,
): DeliveryOrder | null {
  const snapshot = getDeliveryPortalSnapshotBySlug(slug);
  const allOrders = [...snapshot.activeOrders, ...snapshot.completedOrders];

  return allOrders.find((order) => order.id === orderId) ?? null;
}
