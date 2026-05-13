"use client";

import { create } from 'zustand';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';

export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  currency: string;
  image?: string;
  tags?: string[];
  notes?: string;
};

export type TimelineEvent = {
  status: OrderStatus;
  label: string;
  time: string;
};

export type DashboardOrder = {
  id: string;
  code: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: number;
  total: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  status: OrderStatus;
  type: 'dine_in' | 'delivery' | 'pickup';
  address: string;
  paymentMethod: string;
  notes?: string;
  assignedAgentId: string | null;
  createdAt: string;
  orderItems: OrderItem[];
  timeline: TimelineEvent[];
};

interface OrderStore {
  orders: DashboardOrder[];
  assignAgent: (orderId: string, agentId: string) => void;
  updateStatus: (orderId: string, status: OrderStatus) => void;
}

const STATUS_TIMELINE_LABELS: Record<OrderStatus, string> = {
  pending: 'Order Received',
  confirmed: 'Order Accepted',
  preparing: 'Kitchen Started',
  ready: 'Ready for Delivery',
  out_for_delivery: 'Driver Picked Up',
  completed: 'Order Completed',
  cancelled: 'Order Cancelled',
};

// Fixed base time so mock data is identical on SSR and client (prevents hydration mismatch)
const BASE_TIME = new Date("2026-05-13T14:00:00.000Z").getTime();
const timeAgo = (min: number) => new Date(BASE_TIME - min * 60000).toISOString();

const INITIAL_ORDERS: DashboardOrder[] = [
  {
    id: '1',
    code: '#1024',
    customerName: 'Amina Hassan',
    customerPhone: '+971 55 111 2222',
    items: 3,
    subtotal: 122,
    deliveryFee: 15,
    tax: 5,
    total: 142,
    status: 'pending',
    type: 'delivery',
    address: '24 Marina Walk, JLT, Dubai',
    paymentMethod: 'Cash on Delivery',
    notes: 'Please ring the bell twice',
    assignedAgentId: null,
    createdAt: timeAgo(12),
    orderItems: [
      { id: 'a1', name: 'Whipped Hummus', quantity: 1, price: 28, currency: 'AED', image: 'https://images.unsplash.com/photo-1637949385162-e416fb15b2ce?w=200&h=200&fit=crop', tags: ['Popular'] },
      { id: 'a2', name: 'Citrus Grilled Salmon', quantity: 1, price: 68, currency: 'AED', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop', tags: ['Chef Choice'] },
      { id: 'a3', name: 'Date Cake', quantity: 1, price: 26, currency: 'AED', notes: 'Extra caramel sauce' },
    ],
    timeline: [
      { status: 'pending', label: 'Order Received', time: timeAgo(12) },
    ],
  },
  {
    id: '2',
    code: '#1025',
    customerName: 'Khalid Al Mansoori',
    customerPhone: '+971 50 333 4444',
    items: 2,
    subtotal: 78,
    deliveryFee: 0,
    tax: 0,
    total: 78,
    status: 'confirmed',
    type: 'delivery',
    address: 'JLT Cluster Y, Apt 1204, Dubai',
    paymentMethod: 'Card at Counter',
    assignedAgentId: null,
    createdAt: timeAgo(28),
    orderItems: [
      { id: 'b1', name: 'Charred Halloumi', quantity: 1, price: 32, currency: 'AED', tags: ['Vegetarian'] },
      { id: 'b2', name: 'Truffle Mushroom Risotto', quantity: 1, price: 46, currency: 'AED', image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=200&h=200&fit=crop' },
    ],
    timeline: [
      { status: 'pending', label: 'Order Received', time: timeAgo(28) },
      { status: 'confirmed', label: 'Order Accepted', time: timeAgo(25) },
    ],
  },
  {
    id: '3',
    code: '#1026',
    customerName: 'Priya Nair',
    customerPhone: '+971 52 555 6666',
    items: 4,
    subtotal: 185,
    deliveryFee: 15,
    tax: 10,
    total: 210,
    status: 'preparing',
    type: 'delivery',
    address: 'Dubai Marina, Tower 3, Apt 2405',
    paymentMethod: 'Paid Online',
    notes: 'Gate code: 4521',
    assignedAgentId: null,
    createdAt: timeAgo(45),
    orderItems: [
      { id: 'c1', name: 'Whipped Hummus', quantity: 2, price: 28, currency: 'AED' },
      { id: 'c2', name: 'Citrus Grilled Salmon', quantity: 1, price: 68, currency: 'AED', tags: ['Spicy'] },
      { id: 'c3', name: 'Date Cake', quantity: 1, price: 26, currency: 'AED' },
      { id: 'c4', name: 'Labneh Flatbread', quantity: 1, price: 35, currency: 'AED' },
    ],
    timeline: [
      { status: 'pending', label: 'Order Received', time: timeAgo(45) },
      { status: 'confirmed', label: 'Order Accepted', time: timeAgo(42) },
      { status: 'preparing', label: 'Kitchen Started', time: timeAgo(30) },
    ],
  },
  {
    id: '4',
    code: '#1027',
    customerName: 'James Thornton',
    customerPhone: '+971 54 777 8888',
    items: 1,
    subtotal: 65,
    deliveryFee: 0,
    tax: 0,
    total: 65,
    status: 'ready',
    type: 'delivery',
    address: 'Business Bay, Bay Square, Bldg 3, Dubai',
    paymentMethod: 'Cash',
    assignedAgentId: null,
    createdAt: timeAgo(55),
    orderItems: [
      { id: 'd1', name: 'Mosaic Mixed Grill', quantity: 1, price: 65, currency: 'AED', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&h=200&fit=crop', tags: ['Large Portion'] },
    ],
    timeline: [
      { status: 'pending', label: 'Order Received', time: timeAgo(55) },
      { status: 'confirmed', label: 'Order Accepted', time: timeAgo(52) },
      { status: 'preparing', label: 'Kitchen Started', time: timeAgo(40) },
      { status: 'ready', label: 'Ready for Delivery', time: timeAgo(10) },
    ],
  },
  {
    id: '5',
    code: '#1028',
    customerName: 'Sara Al Farsi',
    customerPhone: '+971 56 999 0000',
    items: 5,
    subtotal: 295,
    deliveryFee: 25,
    tax: 20,
    total: 340,
    status: 'out_for_delivery',
    type: 'delivery',
    address: 'Downtown Dubai, Blvd Central, Tower 1',
    paymentMethod: 'Paid Online',
    assignedAgentId: '1',
    createdAt: timeAgo(90),
    orderItems: [
      { id: 'e1', name: 'Whipped Hummus', quantity: 1, price: 28, currency: 'AED' },
      { id: 'e2', name: 'Charred Halloumi', quantity: 2, price: 32, currency: 'AED' },
      { id: 'e3', name: 'Truffle Mushroom Risotto', quantity: 1, price: 46, currency: 'AED' },
      { id: 'e4', name: 'Mosaic Mixed Grill', quantity: 1, price: 65, currency: 'AED' },
      { id: 'e5', name: 'Date Cake', quantity: 2, price: 26, currency: 'AED' },
    ],
    timeline: [
      { status: 'pending', label: 'Order Received', time: timeAgo(90) },
      { status: 'confirmed', label: 'Order Accepted', time: timeAgo(87) },
      { status: 'preparing', label: 'Kitchen Started', time: timeAgo(75) },
      { status: 'ready', label: 'Ready for Delivery', time: timeAgo(60) },
      { status: 'out_for_delivery', label: 'Driver Picked Up', time: timeAgo(45) },
    ],
  },
  {
    id: '6',
    code: '#1029',
    customerName: 'Omar Khaleel',
    customerPhone: '+971 50 222 3333',
    items: 2,
    subtotal: 95,
    deliveryFee: 0,
    tax: 0,
    total: 95,
    status: 'completed',
    type: 'delivery',
    address: 'JBR Walk, Rimal 4, Apt 603, Dubai',
    paymentMethod: 'Card',
    assignedAgentId: null,
    createdAt: timeAgo(180),
    orderItems: [
      { id: 'f1', name: 'Labneh Flatbread', quantity: 1, price: 35, currency: 'AED' },
      { id: 'f2', name: 'Citrus Grilled Salmon', quantity: 1, price: 60, currency: 'AED' },
    ],
    timeline: [
      { status: 'pending', label: 'Order Received', time: timeAgo(180) },
      { status: 'confirmed', label: 'Order Accepted', time: timeAgo(177) },
      { status: 'preparing', label: 'Kitchen Started', time: timeAgo(165) },
      { status: 'ready', label: 'Ready for Delivery', time: timeAgo(150) },
      { status: 'completed', label: 'Order Completed', time: timeAgo(120) },
    ],
  },
];

export const useOrderStore = create<OrderStore>((set) => ({
  orders: INITIAL_ORDERS,
  assignAgent: (orderId, agentId) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, assignedAgentId: agentId } : o
      ),
    })),
  updateStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((o) => {
        if (o.id !== orderId) return o;
        const alreadyExists = o.timeline.some((t) => t.status === status);
        const newEvent: TimelineEvent = {
          status,
          label: STATUS_TIMELINE_LABELS[status],
          time: new Date().toISOString(),
        };
        return {
          ...o,
          status,
          timeline: alreadyExists ? o.timeline : [...o.timeline, newEvent],
        };
      }),
    })),
}));
