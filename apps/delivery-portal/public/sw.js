/** JustSearch Delivery Portal Service Worker */
const STATIC_CACHE = "dp-static-v2", API_CACHE = "dp-api-v2";
const STATIC_ASSETS = ["/","/login","/settings","/earnings","/history","/manifest.json","/icons/icon-192x192.svg","/icons/icon-512x512.svg"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(STATIC_CACHE).then((c) => c.addAll(STATIC_ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== STATIC_CACHE && x !== API_CACHE).map((x) => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const { request } = e, url = new URL(request.url);

  // API: network-first, cache fallback
  if (url.pathname.startsWith("/api/")) {
    e.respondWith(fetch(request).then((r) => { caches.open(API_CACHE).then((cc) => cc.put(request, r.clone())); return r; }).catch(() => caches.match(request)));
    return;
  }

  // HTML pages: network-first (fresh HTML always)
  if (request.mode === "navigate" || request.destination === "document") {
    e.respondWith(fetch(request).then((r) => { if (r?.status === 200 && r.type === "basic") caches.open(STATIC_CACHE).then((cc) => cc.put(request, r.clone())); return r; }).catch(() => caches.match(request)));
    return;
  }

  // Images/fonts: cache-first
  if (request.destination === "image" || request.destination === "font") {
    e.respondWith(caches.match(request).then((c) => c || fetch(request).then((r) => { if (r?.status === 200 && r.type === "basic") caches.open(STATIC_CACHE).then((cc) => cc.put(request, r.clone())); return r; })));
    return;
  }

  e.respondWith(fetch(request));
});

self.addEventListener("push", (e) => {
  if (!e.data) return;
  let p; try { p = e.data.json(); } catch { p = {}; }
  e.waitUntil(self.registration.showNotification(p.title || "New Delivery", {
    body: p.body || "Tap to view", icon: "/icons/icon-192x192.svg", badge: "/icons/icon-192x192.svg",
    tag: p.tag || "delivery-order", requireInteraction: true, renotify: true,
    vibrate: p.vibrate || [500, 200, 500, 200, 500, 200, 800], data: p.data || { url: "/" },
    actions: p.actions || [{ action: "open", title: "View" }, { action: "dismiss", title: "Dismiss" }],
  }));
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

self.addEventListener("sync", (e) => { if (e.tag === "delivery-status-sync") e.waitUntil(syncPending()); });

async function syncPending() {
  try {
    const db = await openDb(), items = await db.getAll("pendingStatusUpdates");
    await Promise.all(items.map(async (item) => {
      try { const r = await fetch(item.url, { method: item.method || "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item.body) }); if (r.ok) await db.delete("pendingStatusUpdates", item.id); } catch { /* retry next time */ }
    }));
  } catch { /* ignore */ }
}

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("delivery-sync-db", 1);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (e) => {
      const db = /** @type {IDBOpenDBRequest} */ (e.target).result;
      if (!db.objectStoreNames.contains("pendingStatusUpdates")) db.createObjectStore("pendingStatusUpdates", { keyPath: "id", autoIncrement: true });
    };
  });
}
self.addEventListener("message", (e) => { if (e.data?.type === "SKIP_WAITING") self.skipWaiting(); });
