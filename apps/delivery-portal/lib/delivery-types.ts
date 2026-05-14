export type DeliveryAgentStatus = 'online' | 'busy' | 'offline';
export type DeliveryPriority = 'standard' | 'rush';
export type DeliveryPaymentMode = 'prepaid' | 'cash_on_delivery';
export type DeliveryOrderStatus =
  | 'assigned'
  | 'picked_up'
  | 'on_route'
  | 'arrived'
  | 'delivered';

export type DeliveryPortalRestaurant = {
  slug: string;
  name: string;
  deliveryDomain: string;
  zoneLabel: string;
  supportPhone: string;
};

export type DeliveryAgent = {
  id: string;
  name: string;
  phone: string;
  vehicleType: 'Bike' | 'Scooter' | 'Car';
  shiftLabel: string;
  status: DeliveryAgentStatus;
  rating: number;
  completedToday: number;
};

export type DeliveryMetric = {
  label: string;
  value: string;
  hint: string;
  tone: 'default' | 'success' | 'warning';
};

export type DeliveryOrderItem = {
  name: string;
  quantity: number;
  price: number;
  currency: string;
};

export type DeliveryOrder = {
  id: string;
  code: string;
  customerName: string;
  customerPhone: string;
  neighborhood: string;
  dropoffAddress: string;
  latitude: number;
  longitude: number;
  orderedAtLabel: string;
  etaMinutes: number;
  itemCount: number;
  orderValue: string;
  orderItems: DeliveryOrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  paymentMode: DeliveryPaymentMode;
  status: DeliveryOrderStatus;
  priority: DeliveryPriority;
  notes?: string;
};

export type DeliveryPortalSnapshot = {
  restaurant: DeliveryPortalRestaurant;
  agent: DeliveryAgent;
  metrics: DeliveryMetric[];
  activeOrders: DeliveryOrder[];
  completedOrders: DeliveryOrder[];
  routeChecklist: string[];
  routeHealthLabel: string;
  supportNotice: string;
};
