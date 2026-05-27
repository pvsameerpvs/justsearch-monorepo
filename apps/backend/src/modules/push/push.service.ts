import webpush from 'web-push';
import { sql } from 'drizzle-orm';
import { db } from '../../db';
import { ensurePushInitialized } from './push.config';
import { buildNewOrderPushPayload } from './push.payload';
import type { NewOrderPushInput, PushSubscription } from './push.types';

export type { PushSubscription } from './push.types';

export async function storePushSubscription(
  schemaName: string,
  agentId: string,
  subscription: PushSubscription
): Promise<void> {
  ensurePushInitialized();
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
  ensurePushInitialized();
  await db.execute(
    sql`UPDATE ${sql.identifier(schemaName)}.${sql.identifier('delivery_agents')}
        SET push_subscription = NULL, updated_at = NOW()
        WHERE push_subscription->>'endpoint' = ${endpoint}`
  );
}

export async function notifyDriverOfNewOrder(
  schemaName: string,
  agentId: string,
  order: NewOrderPushInput
): Promise<{ success: boolean; error?: string }> {
  try {
    ensurePushInitialized();

    const [agent] = await db.execute<Record<string, unknown>>(
      sql`SELECT push_subscription FROM ${sql.identifier(schemaName)}.${sql.identifier('delivery_agents')}
          WHERE id = ${agentId} AND push_subscription IS NOT NULL`
    );

    if (!agent || !agent.push_subscription) {
      return { success: false, error: 'Driver has no push subscription' };
    }

    const subscription = agent.push_subscription as unknown as PushSubscription;

    const payload = buildNewOrderPushPayload(order);

    await webpush.sendNotification(
      subscription as webpush.PushSubscription,
      JSON.stringify(payload)
    );

    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // If subscription is expired/invalid, clear it
    if (msg.includes('expired') || msg.includes('Not subscribed') || msg.includes('unsubscribed')) {
      const endpoint = getFailedEndpoint(err);
      if (endpoint) await removePushSubscription(schemaName, endpoint);
    }
    return { success: false, error: msg };
  }
}

function getFailedEndpoint(err: unknown): string | null {
  if (!err || typeof err !== 'object') return null;
  const endpoint = (err as { endpoint?: unknown }).endpoint;
  return typeof endpoint === 'string' ? endpoint : null;
}
