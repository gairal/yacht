/* eslint-disable */
self.addEventListener('install', function (e) {
  try {
    e.waitUntil(caches.open('yacht').then(function (cache) {
      return cache.addAll(
        [
          '/',
          '/js/app.js',
          '/css/app.css',
          '/db/yacht.json',
        ]
      );
    }).catch(err => console.error(err)));
  } catch (error) {}
});

self.addEventListener('fetch', function (event) {
  event.respondWith(caches.match(event.request).then(function (response) {
    return response || fetch(event.request);
  }).catch(err => console.error(err)));
});
/* eslint-enable */
