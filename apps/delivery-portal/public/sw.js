/** JustSearch Delivery Portal Service Worker */
const STATIC_CACHE = "dp-static-v1";
const API_CACHE = "dp-api-v1";
const STATIC_ASSETS = ["/","/login","/settings","/earnings","/history","/manifest.json","/icons/icon-192x192.svg","/icons/icon-512x512.svg"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(STATIC_CACHE).then((c) => c.addAll(STATIC_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== STATIC_CACHE && x !== API_CACHE).map((x) => caches.delete(x)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/")) {
    e.respondWith(fetch(request).then((r) => { const c = r.clone(); caches.open(API_CACHE).then((cc) => cc.put(request, c)); return r; }).catch(() => caches.match(request)));
    return;
  }
  if (request.mode === "navigate" || request.destination === "image" || request.destination === "document") {
    e.respondWith(caches.match(request).then((c) => c || fetch(request).then((r) => { if (r && r.status === 200 && r.type === "basic") { const cl = r.clone(); caches.open(STATIC_CACHE).then((cc) => cc.put(request, cl)); } return r; })));
    return;
  }
  e.respondWith(fetch(request));
});

self.addEventListener("push", (e) => {
  if (!e.data) return;
  let p; try { p = e.data.json(); } catch { p = {}; }
  const opts = {
    body: p.body || "Tap to view", icon: "/icons/icon-192x192.svg", badge: "/icons/icon-192x192.svg",
    tag: p.tag || "delivery-order", requireInteraction: true, renotify: true,
    vibrate: p.vibrate || [500, 200, 500, 200, 500, 200, 800], data: p.data || { url: "/" },
    actions: p.actions || [{ action: "open", title: "View" }, { action: "dismiss", title: "Dismiss" }],
  };
  e.waitUntil(self.registration.showNotification(p.title || "New Delivery", opts));
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  if (e.action === "dismiss") return;
  const url = e.notification.data?.url || "/";
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((cs) => {
    const f = cs.find((c) => c.focused);
    if (f) { f.postMessage({ type: "NOTIFICATION_CLICK", url }); return f.navigate(url); }
    const ex = cs.find((c) => c.url.includes(url));
    if (ex) return ex.focus();
    return self.clients.openWindow(url);
  }));
});

self.addEventListener("sync", (e) => {
  if (e.tag === "delivery-status-sync") e.waitUntil(syncPending());
});

async function syncPending() {
  try {
    const db = await openDb();
    const items = await db.getAll("pendingStatusUpdates");
    await Promise.all(items.map(async (item) => {
      try {
        const r = await fetch(item.url, { method: item.method || "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item.body) });
        if (r.ok) await db.delete("pendingStatusUpdates", item.id);
      } catch { /* keep for retry */ }
    }));
  } catch { /* ignore */ }
}

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("delivery-sync-db", 1);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("pendingStatusUpdates")) db.createObjectStore("pendingStatusUpdates", { keyPath: "id", autoIncrement: true });
    };
  });
}
self.addEventListener("message", (e) => { if (e.data?.type === "SKIP_WAITING") self.skipWaiting(); });
