// Service worker básico para PWA
self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
    // Estrategia "network falling back to cache" o simplemente fetch
    e.respondWith(fetch(e.request).catch(() => new Response('Offline')));
});
