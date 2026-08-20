/* Shadow Box — Service Worker (instalable en Windows y Android, funciona sin conexión) */
const CACHE = 'shadow-box-v10';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',
  './js/boxer.js',
  './js/routines.js',
  './js/app.js',
  './js/firebase-config.js',
  './js/auth.js',
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

const FIREBASE_CDN = [
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS))
      .then(() => caches.open(CACHE + '-cdn'))
      .then((c) => Promise.allSettled(FIREBASE_CDN.map((url) => c.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE && k !== CACHE + '-cdn').map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clients) => clients.forEach((c) => c.navigate(c.url))))
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = e.request.url;
  const isFirebaseCDN = url.includes('gstatic.com/firebasejs') || url.includes('firebaseio.com');
  const cacheName = isFirebaseCDN ? CACHE + '-cdn' : CACHE;
  e.respondWith(
    caches.match(e.request).then((hit) =>
      hit || fetch(e.request).then((res) => {
        const copy = res.clone();
        if (res.ok && (url.startsWith(self.location.origin) || isFirebaseCDN)) {
          caches.open(cacheName).then((c) => c.put(e.request, copy));
        }
        return res;
      }).catch(() => caches.match('./index.html'))
    )
  );
});
