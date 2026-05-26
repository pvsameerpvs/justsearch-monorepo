import type { DemoOrder } from './demo-orders.data';

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}

export function makeOrdersGroupA(): DemoOrder[] {
  return [
    {
      code: `JS-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: 'Amina Hassan',
      customerPhone: '+971501234567',
      status: 'completed',
      fulfillmentType: 'delivery',
      subtotal: '128.00',
      deliveryFee: '10.00',
      tax: '5.00',
      total: '143.00',
      createdAt: hoursAgo(2),
      items: [
        { name: 'Whipped Hummus', quantity: 1, price: '42.00' },
        { name: 'Citrus Grilled Salmon', quantity: 1, price: '86.00' },
      ],
    },
    {
      code: `JS-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: 'Khalid Al Mansoori',
      customerPhone: '+971509876543',
      status: 'completed',
      fulfillmentType: 'delivery',
      subtotal: '68.00',
      deliveryFee: '10.00',
      tax: '3.00',
      total: '81.00',
      createdAt: hoursAgo(5),
      items: [
        { name: 'Charred Halloumi', quantity: 2, price: '34.00' },
      ],
    },
    {
      code: `JS-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: 'Priya Nair',
      customerPhone: '+971505551212',
      status: 'preparing',
      fulfillmentType: 'delivery',
      subtotal: '185.00',
      deliveryFee: '10.00',
      tax: '7.00',
      total: '202.00',
      createdAt: hoursAgo(1),
      items: [
        { name: 'Truffle Mushroom Risotto', quantity: 1, price: '95.00' },
        { name: 'Date Cake', quantity: 2, price: '45.00' },
        { name: 'Whipped Hummus', quantity: 1, price: '42.00' },
      ],
    },
  ];
}
