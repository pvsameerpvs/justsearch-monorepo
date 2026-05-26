import type { DemoOrder } from './demo-orders.data';

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}

export function makeOrdersGroupB(): DemoOrder[] {
  return [
    {
      code: `JS-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: 'James Thornton',
      customerPhone: '+971501112233',
      status: 'ready',
      fulfillmentType: 'delivery',
      subtotal: '96.00',
      deliveryFee: '10.00',
      tax: '4.00',
      total: '110.00',
      createdAt: hoursAgo(3),
      items: [
        { name: 'Citrus Grilled Salmon', quantity: 1, price: '86.00' },
        { name: 'Date Cake', quantity: 1, price: '20.00' },
      ],
    },
    {
      code: `JS-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: 'Sara Al Farsi',
      customerPhone: '+971504445566',
      status: 'out_for_delivery',
      fulfillmentType: 'delivery',
      subtotal: '54.00',
      deliveryFee: '10.00',
      tax: '2.00',
      total: '66.00',
      createdAt: hoursAgo(4),
      items: [
        { name: 'Charred Halloumi', quantity: 1, price: '34.00' },
        { name: 'Whipped Hummus', quantity: 1, price: '42.00' },
      ],
    },
  ];
}
