/** JustSearch Delivery Portal Service Worker */
const STATIC_CACHE = "dp-static-v4";
const API_CACHE = "dp-api-v4";

const STATIC_ASSETS = [
  "/",
  "/login",
  "/settings",
  "/earnings",
  "/history",
  "/manifest.json",
  "/icons/icon-192x192.svg",
  "/icons/icon-512x512.svg",
];

/* ── INSTALL: wipe old caches + pre-cache ── */
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => caches.open(STATIC_CACHE))
      .then((cache) =>
        Promise.all(STATIC_ASSETS.map((url) => cache.add(url).catch(() => {})))
      )
      .then(() => self.skipWaiting())
  );
});

/* ── ACTIVATE: claim clients immediately ── */
self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

/* ── FETCH: network-first HTML, cache-first images, stale-while-revalidate API ── */
self.addEventListener("fetch", (e) => {
  const { request } = e;
  const url = new URL(request.url);

  if (url.pathname.startsWith("/api/")) {
    e.respondWith(
      fetch(request)
        .then((res) => {
          caches.open(API_CACHE).then((c) => c.put(request, res.clone()));
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  if (request.mode === "navigate" || request.destination === "document") {
    e.respondWith(
      fetch(request)
        .then((res) => {
          if (res?.status === 200 && res.type === "basic") {
            caches.open(STATIC_CACHE).then((c) => c.put(request, res.clone()));
          }
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  if (request.destination === "image" || request.destination === "font") {
    e.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            if (res?.status === 200 && res.type === "basic") {
              caches.open(STATIC_CACHE).then((c) => c.put(request, res.clone()));
            }
            return res;
          })
      )
    );
    return;
  }

  e.respondWith(fetch(request));
});

/* ── PUSH: notify ALL clients (foreground + background) ── */
self.addEventListener("push", (e) => {
  if (!e.data) return;

  let payload;
  try {
    payload = e.data.json();
  } catch {
    payload = {};
  }

  const title = payload.title || "New Delivery";
  const orderId = payload.orderId || payload.data?.orderId;
  const orderCode = payload.orderCode || payload.data?.orderCode;

  const notificationOptions = {
    body: payload.body || "You have a new order assignment",
    icon: payload.icon || "/icons/icon-192x192.svg",
    badge: "/icons/icon-192x192.svg",
    tag: payload.tag || "delivery-order-" + Date.now(),
    requireInteraction: true,
    renotify: true,
    silent: false,
    vibrate: payload.vibrate || [800, 200, 800, 200, 800, 400, 1200, 200, 600, 200, 600],
    data: { url: "/", orderId, orderCode, ...(payload.data || {}) },
    actions: payload.actions || [
      { action: "open", title: "View Order" },
      { action: "dismiss", title: "Dismiss" },
    ],
  };

  e.waitUntil(
    Promise.all([
      // 1. Show system notification (works when app is closed/background)
      self.registration.showNotification(title, notificationOptions),

      // 2. Send message to ALL open app windows (works when app is foreground)
      self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
        const message = {
          type: "PUSH_RECEIVED",
          title,
          body: notificationOptions.body,
          orderId,
          orderCode,
          vibrate: notificationOptions.vibrate,
          timestamp: Date.now(),
        };
        clients.forEach((client) => client.postMessage(message));
      }),
    ])
  );
});

/* ── NOTIFICATION CLICK ── */
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  if (e.action === "dismiss") return;

  const url = e.notification.data?.url || "/";
  const orderId = e.notification.data?.orderId;

  e.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        const focused = clients.find((c) => c.focused);
        if (focused) {
          focused.postMessage({ type: "PUSH_CLICK", orderId, url });
          return focused.navigate(url);
        }
        const existing = clients.find((c) => c.url.includes(url));
        if (existing) return existing.focus();
        return self.clients.openWindow(url);
      })
  );
});

/* ── BACKGROUND SYNC ── */
self.addEventListener("sync", (e) => {
  if (e.tag === "delivery-status-sync") e.waitUntil(syncPending());
});

async function syncPending() {
  try {
    const db = await openDb();
    const items = await db.getAll("pendingStatusUpdates");
    await Promise.all(
      items.map(async (item) => {
        try {
          const res = await fetch(item.url, {
            method: item.method || "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item.body),
          });
          if (res.ok) await db.delete("pendingStatusUpdates", item.id);
        } catch {
          /* leave for next sync */
        }
      })
    );
  } catch {
    /* noop */
  }
}

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("delivery-sync-db", 1);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (e) => {
      const db = /** @type {IDBOpenDBRequest} */ (e.target).result;
      if (!db.objectStoreNames.contains("pendingStatusUpdates")) {
        db.createObjectStore("pendingStatusUpdates", { keyPath: "id", autoIncrement: true });
      }
    };
  });
}

/* ── SKIP WAITING MESSAGE ── */
self.addEventListener("message", (e) => {
  if (e.data?.type === "SKIP_WAITING") self.skipWaiting();
});
