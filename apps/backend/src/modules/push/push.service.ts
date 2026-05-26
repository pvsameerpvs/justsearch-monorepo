import webpush from 'web-push';
import { sql } from 'drizzle-orm';
import { db } from '../../db';

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@eatygo.com';

let initialized = false;

function ensureInitialized() {
  if (initialized) return;
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    throw new Error('VAPID keys not configured. Set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY in .env');
  }
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  initialized = true;
}

export interface PushSubscription {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  renotify?: boolean;
  silent?: boolean;
  vibrate?: number[];
  data?: Record<string, unknown>;
  actions?: Array<{ action: string; title: string }>;
}

export async function storePushSubscription(
  schemaName: string,
  agentId: string,
  subscription: PushSubscription
): Promise<void> {
  ensureInitialized();
  await db.execute(
    sql`UPDATE ${sql.identifier(schemaName)}.${sql.identifier('delivery_agents')}
        SET push_subscription = ${JSON.stringify(subscription)}, updated_at = NOW()
        WHERE id = ${agentId}`
  );
}

export async function removePushSubscription(
  schemaName: string,
  endpoint: string
): Promise<void> {
  ensureInitialized();
  await db.execute(
    sql`UPDATE ${sql.identifier(schemaName)}.${sql.identifier('delivery_agents')}
        SET push_subscription = NULL, updated_at = NOW()
        WHERE push_subscription->>'endpoint' = ${endpoint}`
  );
}

export async function notifyDriverOfNewOrder(
  schemaName: string,
  agentId: string,
  orderCode: string,
  customerAddress: string
): Promise<{ success: boolean; error?: string }> {
  try {
    ensureInitialized();

    const [agent] = await db.execute<Record<string, unknown>>(
      sql`SELECT push_subscription FROM ${sql.identifier(schemaName)}.${sql.identifier('delivery_agents')}
          WHERE id = ${agentId} AND push_subscription IS NOT NULL`
    );

    if (!agent || !agent.push_subscription) {
      return { success: false, error: 'Driver has no push subscription' };
    }

    const subscription = agent.push_subscription as unknown as PushSubscription;

    const payload: NotificationPayload = {
      title: 'New Delivery Assigned',
      body: `Order ${orderCode} — ${customerAddress}`,
      icon: '/icons/icon-192x192.svg',
      badge: '/icons/icon-192x192.svg',
      tag: `order-${orderCode}`,
      requireInteraction: true,
      renotify: true,
      silent: false,
      vibrate: [800, 200, 800, 200, 800, 400, 1200, 200, 600, 200, 600],
      data: { url: '/', orderCode },
      actions: [
        { action: 'open', title: 'View Order' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    };

    await webpush.sendNotification(
      subscription as webpush.PushSubscription,
      JSON.stringify(payload)
    );

    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // If subscription is expired/invalid, clear it
    if (msg.includes('expired') || msg.includes('Not subscribed') || msg.includes('unsubscribed')) {
      await removePushSubscription(schemaName, (err as any).endpoint || '');
    }
    return { success: false, error: msg };
  }
}
