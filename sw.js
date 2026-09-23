// 网络优先：有网拿最新并更新缓存；没网用缓存
const CACHE = 'kansai-trip-202609231930';
const ASSETS = ["./", "./index.html", "./styles.css", "./ledger.css", "./app.js", "./ledger.js", "./overview-map.js", "./route-ui.js", "./site-navigation.js", "./runtime-storage.js", "./ticket-pdf-preview.js", "./extras.js", "./trip-data.json", "./assets/maps/kansai-osm.webp", "./manifest.webmanifest", "./icon.svg", "./icon-180.png", "./icon-192.png", "./icon-512.png"];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }));
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request).then(function (r) {
      var copy = r.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      return r;
    }).catch(function () {
      return caches.match(e.request, { ignoreSearch: true }).then(function (m) { return m || caches.match('./index.html'); });
    })
  );
});
