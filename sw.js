/* Shadow Box — Service Worker (instalable en Windows y Android, funciona sin conexión) */
const CACHE = 'shadow-box-v9';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',
  './js/boxer.js',
  './js/routines.js',
  './js/app.js',
  './images/rutina-modo-guerra.png',
  './images/guardia.png',
  './images/jab.png',
  './images/jabcross.png',
  './images/hook.png',
  './images/uppercut.png',
  './images/defensa.png',
  './images/bob.png',
  './images/footwork.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clients) => clients.forEach((c) => c.navigate(c.url))))
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((hit) =>
      hit || fetch(e.request).then((res) => {
        const copy = res.clone();
        if (res.ok && e.request.url.startsWith(self.location.origin)) {
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      }).catch(() => caches.match('./index.html'))
    )
  );
});
