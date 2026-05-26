/**
 * ================================================================
 * JUSTSEARCH BACKEND — PUSH NOTIFICATION IMPLEMENTATION
 * ================================================================
 * 
 * This file contains the EXACT backend code your team needs to
 * implement for driver push notifications to work.
 * 
 * Stack: Node.js + Express (or Fastify/Nest) + web-push npm package
 * Database: Add ONE column to delivery_agents table
 * 
 * Timeline: 1-2 hours for a backend developer
 * ================================================================
 */

// ── STEP 1: INSTALL DEPENDENCY ─────────────────────────────────
// npm install web-push
// or: pnpm add web-push

// ── STEP 2: ADD DATABASE COLUMN ────────────────────────────────
// ALTER TABLE delivery_agents ADD COLUMN push_subscription JSONB;

// ── STEP 3: ENVIRONMENT VARIABLES (.env) ──────────────────────
/*
VAPID_PUBLIC_KEY=BJP8a37Ss19VkXGu_AzHkpDJMs_ZeG8zTXCf3w0YJ5-uuONop2R0GKHVrm5BrOZa8ENEpWwTIEOdagMEFIDM0RQ
VAPID_PRIVATE_KEY=fE_rJcM2svEn9UEVbP86jJnlWqAvIlc907QTzJyNoCg
VAPID_SUBJECT=mailto:admin@yourdomain.com

// These keys were generated once with: npx web-push generate-vapid-keys
// NEVER regenerate — both frontend + backend must use the same pair
*/

// ── STEP 4: INITIALIZE WEB-PUSH ───────────────────────────────
import webpush from 'web-push';

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@yourdomain.com';

webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

// ── STEP 5: PUSH SUBSCRIPTION ROUTES ─────────────────────────

/**
 * POST /api/v1/push/subscribe
 * Body: { endpoint: string, p256dh: string, auth: string }
 * Auth: Driver JWT required
 */
export async function subscribePush(req, res) {
  const driverId = req.user.id; // from JWT middleware
  const { endpoint, p256dh, auth } = req.body;

  if (!endpoint || !p256dh || !auth) {
    return res.status(400).json({ error: 'Missing subscription keys' });
  }

  // Store in delivery_agents table
  await db.execute(
    `UPDATE delivery_agents 
     SET push_subscription = $1 
     WHERE id = $2`,
    [JSON.stringify({ endpoint, keys: { p256dh, auth } }), driverId]
  );

  // Send test notification immediately to confirm it works
  try {
    await webpush.sendNotification(
      { endpoint, keys: { p256dh, auth } },
      JSON.stringify({
        title: 'Notifications Active',
        body: 'You will now receive order alerts even when the app is closed.',
      })
    );
  } catch (err) {
    console.warn('Test push failed:', err.message);
  }

  res.json({ success: true, message: 'Subscribed to push notifications' });
}

/**
 * POST /api/v1/push/unsubscribe
 * Body: { endpoint: string }
 * Auth: Driver JWT required
 */
export async function unsubscribePush(req, res) {
  const driverId = req.user.id;
  const { endpoint } = req.body;

  // Verify the endpoint belongs to this driver, then remove
  await db.execute(
    `UPDATE delivery_agents 
     SET push_subscription = NULL 
     WHERE id = $1 AND push_subscription->>'endpoint' = $2`,
    [driverId, endpoint]
  );

  res.json({ success: true, message: 'Unsubscribed from push notifications' });
}

// ── STEP 6: SEND PUSH WHEN ORDER ASSIGNED ────────────────────

/**
 * Call this function whenever a new order is assigned to a driver
 * 
 * @param {string} driverId - The delivery agent ID
 * @param {object} order - The order object
 */
export async function notifyDriverOfNewOrder(driverId, order) {
  // 1. Get driver's push subscription from DB
  const result = await db.execute(
    `SELECT push_subscription FROM delivery_agents WHERE id = $1`,
    [driverId]
  );

  const subscription = result.rows[0]?.push_subscription;
  if (!subscription) {
    console.log(`Driver ${driverId} has no push subscription`);
    return { success: false, reason: 'no_subscription' };
  }

  // 2. Build notification payload
  const payload = JSON.stringify({
    title: 'New Order Assigned',
    body: `Order ${order.code} — ${order.customer_name} — AED ${order.total}`,
    icon: order.restaurant_logo_url || '/icons/icon-192x192.svg',
    badge: '/icons/icon-192x192.svg',
    tag: `order-${order.id}`,
    requireInteraction: true,
    renotify: true,
    vibrate: [800, 200, 800, 200, 800, 400, 1200, 200, 600, 200, 600],
    data: {
      url: '/',
      orderId: order.id,
      code: order.code,
    },
    actions: [
      { action: 'open', title: 'View Order' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  });

  // 3. Send push
  try {
    await webpush.sendNotification(subscription, payload);
    console.log(`Push sent to driver ${driverId} for order ${order.code}`);
    return { success: true };
  } catch (err) {
    console.error(`Push failed for driver ${driverId}:`, err.message);

    // If subscription is expired/invalid, remove it
    if (err.statusCode === 410 || err.statusCode === 404) {
      await db.execute(
        `UPDATE delivery_agents SET push_subscription = NULL WHERE id = $1`,
        [driverId]
      );
      console.log(`Removed expired subscription for driver ${driverId}`);
    }

    return { success: false, reason: 'send_failed', error: err.message };
  }
}

// ── STEP 7: INTEGRATE INTO ORDER ASSIGNMENT FLOW ─────────────

/**
 * In your existing order assignment code, add ONE line:
 * 
 * Example in your current order assignment handler:
 */
export async function assignOrderToDriver(orderId, driverId) {
  // ... your existing assignment logic ...
  
  await db.execute(
    `UPDATE delivery_assignments SET agent_id = $1, status = 'assigned' WHERE order_id = $2`,
    [driverId, orderId]
  );

  // 👇 ADD THIS ONE LINE:
  await notifyDriverOfNewOrder(driverId, order);

  return { success: true };
}

// ── STEP 8: FULL EXPRESS ROUTER (Copy-Paste Ready) ──────────

import { Router } from 'express';
const pushRouter = Router();

pushRouter.post('/subscribe', authenticateDriver, subscribePush);
pushRouter.post('/unsubscribe', authenticateDriver, unsubscribePush);

// Mount in your main router:
// app.use('/api/v1/push', pushRouter);

// ── STEP 9: TESTING ────────────────────────────────────────────

/**
 * Quick test endpoint — send a test push to yourself
 */
pushRouter.post('/test', authenticateDriver, async (req, res) => {
  const driverId = req.user.id;
  const result = await notifyDriverOfNewOrder(driverId, {
    id: 'test',
    code: 'TEST-001',
    customer_name: 'Test Customer',
    total: '99.00',
  });
  res.json(result);
});

// ── SUMMARY CHECKLIST ─────────────────────────────────────────

/**
 * Your backend team must:
 * 
 * [ ] 1. Run: npx web-push generate-vapid-keys
 * [ ] 2. Add VAPID_PUBLIC_KEY to .env (same as frontend VAPID_KEY)
 * [ ] 3. Add VAPID_PRIVATE_KEY to .env (keep secret)
 * [ ] 4. Add push_subscription JSONB column to delivery_agents
 * [ ] 5. npm install web-push
 * [ ] 6. Copy the subscribe/unsubscribe routes above
 * [ ] 7. Call notifyDriverOfNewOrder() when assigning orders
 * [ ] 8. Deploy
 * 
 * After this, drivers will receive notifications even when:
 * - App is closed
 * - Phone is locked
 * - Driver is using another app
 */
