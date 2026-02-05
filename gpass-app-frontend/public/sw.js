const CACHE_NAME = "gpass-cache-v1"
const ASSETS = [
  "/", 
  "/manifest.json",
  "/favicon.ico",
]

// Install: cache alap fájlok
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  )
  self.skipWaiting()
})

// Activate: régi cache-ek törlése
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null)))
    )
  )
  self.clients.claim()
})

// Fetch: hálózat első, fallback cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  )
})
