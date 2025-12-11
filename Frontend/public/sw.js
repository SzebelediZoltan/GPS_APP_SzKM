// public/sw.js

const CACHE_NAME = "v1";

self.addEventListener("install", (event) => {
  console.log("[SW] Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Ide tehetsz alap fájlokat, ha akarsz
      return cache.addAll([
        "/",        // index.html
        "/favicon.ico",
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activate");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      // Ha cache-ben van, azt adja vissza, egyébként a hálózatot
      return cached || fetch(event.request);
    })
  );
});