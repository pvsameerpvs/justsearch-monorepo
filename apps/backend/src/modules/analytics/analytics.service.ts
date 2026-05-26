import { eq, sql } from 'drizzle-orm';
import { db } from '../../db';
import { userRestaurants, advertisements } from '../../db/schema';
import { t, mapRows } from '../../lib/tenant-sql';
import { getUtcDayBounds, safeStringArray, sumTotals } from './analytics.utils';

export async function fetchTodayOrders(schemaName: string, restaurantId: string) {
  const { start, end } = getUtcDayBounds(0);
  return mapRows(await db.execute<Record<string, unknown>>(sql`
    SELECT * FROM ${t(schemaName, 'orders')}
    WHERE restaurant_id = ${restaurantId}
      AND created_at >= ${start}::timestamptz
      AND created_at <= ${end}::timestamptz
  `));
}

export async function fetchAllOrders(schemaName: string, restaurantId: string) {
  return mapRows(await db.execute<Record<string, unknown>>(sql`
    SELECT * FROM ${t(schemaName, 'orders')}
    WHERE restaurant_id = ${restaurantId}
  `));
}

export async function fetchCustomerCount(restaurantId: string) {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(userRestaurants)
    .where(eq(userRestaurants.restaurantId, restaurantId));
  return result[0]?.count ?? 0;
}

export async function fetchAdStats(restaurantId: string) {
  const allAds = await db.select().from(advertisements);
  let adRevenue = 0;
  let adViews = 0;

  for (const ad of allAds) {
    const targets = safeStringArray(ad.targetRestaurants);
    if (targets.length === 0 || targets.includes(restaurantId)) {
      adRevenue += Number(ad.revenueRestaurant ?? 0);
      adViews += Number(ad.totalViews3s ?? 0) + Number(ad.totalViewsFull ?? 0);
    }
  }

  return { adRevenue, adViews };
}

export async function fetchOrderItems(schemaName: string, restaurantId: string) {
  return mapRows(await db.execute<Record<string, unknown>>(sql`
    SELECT * FROM ${t(schemaName, 'order_items')}
    WHERE restaurant_id = ${restaurantId}
  `));
}

export function buildTrend(allOrders: Record<string, unknown>[], days: number) {
  return Array.from({ length: days }, (_, i) => {
    const { start, end } = getUtcDayBounds(days - 1 - i);
    const dayStartMs = new Date(start).getTime();
    const dayEndMs = new Date(end).getTime();

    const dayOrders = allOrders.filter((o) => {
      const createdAt = o.createdAt instanceof Date ? o.createdAt : new Date(String(o.createdAt));
      return createdAt.getTime() >= dayStartMs && createdAt.getTime() <= dayEndMs;
    });

    return {
      date: start.split('T')[0],
      orders: dayOrders.length,
      revenue: sumTotals(dayOrders.filter((o) => o.status === 'completed')),
    };
  });
}
