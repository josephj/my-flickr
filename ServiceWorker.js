
this.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open('v6').then(function (cache) {
      return cache.addAll([
        './favicon.ico',
        './fallback.html',
        './index.html',
        './ServiceWorker.js',
        './static/css/main.c34e0525.js',
        './static/js/main.d473c651.js'
      ])
    })
  );
});

this.addEventListener('fetch', (e) => {
  var request = e.request;
  var requestURL = new URL(e.request.url);
  if (
    requestURL.hostname === 'api.flickr.com' ||
    /\.staticflickr\.com$/.test(requestURL.hostname)
  ) {
    e.respondWith(
      caches.match(e.request)
      .then(response => response || fetch(e.request).then(response => {
        return caches.open('v6').then(cache => {
          cache.put(e.request, response.clone());
          return response;
        })
      }))
    )
  } else if (e.request.url.indexOf('sockjs-node') !== -1)  { // Other assets
    e.respondWith(fetch(e.request));
  } else { // Other assets
    e.respondWith(
      caches.match(e.request)
      .catch(() => e.default())
      .catch(() => caches.match('/fallback.html'))
    );
  }
});
