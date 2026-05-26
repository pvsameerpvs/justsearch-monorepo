import { client } from './index';
import { makeOrdersGroupA, makeOrdersGroupB } from './demo-orders.data';

export async function seedTenantDemoData(schemaName: string, restaurantId: string): Promise<void> {
  const demoOrders = [...makeOrdersGroupA(), ...makeOrdersGroupB()];

  for (const order of demoOrders) {
    const orderResult = await client.unsafe(
      `INSERT INTO "${schemaName}"."orders" (
        restaurant_id, code, customer_name, customer_phone,
        status, payment_status, fulfillment_type, source,
        subtotal, delivery_fee, tax, total, created_at, updated_at
      ) VALUES ($1,$2,$3,$4,$5,'unpaid',$6,'direct_web',$7,$8,$9,$10,$11,$12) RETURNING id`,
      [
        restaurantId, order.code, order.customerName, order.customerPhone,
        order.status, order.fulfillmentType,
        order.subtotal, order.deliveryFee, order.tax, order.total,
        order.createdAt, order.createdAt,
      ]
    );

    const orderId = orderResult[0]?.id;
    if (!orderId) continue;

    for (const item of order.items) {
      await client.unsafe(
        `INSERT INTO "${schemaName}"."order_items" (
          restaurant_id, order_id, name, quantity, price, currency
        ) VALUES ($1,$2,$3,$4,$5,'AED')`,
        [restaurantId, orderId, item.name, item.quantity, item.price]
      );
    }
  }
}
