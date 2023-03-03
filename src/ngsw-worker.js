const cacheName = 'v1';
const cacheFiles = [
  '/index.html',
  '/assets/styles.css',
  '/assets/app.js'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Installed');

  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching cacheFiles');
      return cache.addAll(cacheFiles);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activated');

  e.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(cacheNames.map(function(thisCacheName) {
        if (thisCacheName !== cacheName) {
          console.log('[ServiceWorker] Removing Cached Files from Cache - ', thisCacheName);
          return caches.delete(thisCacheName);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(event) {
  const requestURL = new URL(event.request.url);
  const isAPIRequest = requestURL.pathname.startsWith('/api');

  if (isAPIRequest) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        console.log('[ServiceWorker] Returning response from cache:', event.request.url);
        return response;
      }

      let fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(function(response) {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          console.log('[ServiceWorker] Failed to fetch:', event.request.url);
          return response;
        }

        let responseToCache = response.clone();

        caches.open(cacheName).then(function(cache) {
          console.log('[ServiceWorker] Caching response:', event.request.url);
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
