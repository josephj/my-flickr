
this.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open('v5').then(function (cache) {
      return cache.addAll([
        './',
        './favicon.ico',
        './fallback.html',
        './index.html',
        './ServiceWorker.js',
        './static/js/bundle.js',
        './static/js/main.*.js',
        './static/css/main.*.css'
      ])
    })
  );
});

this.addEventListener('fetch', (e) => {
  var request = e.request;
  var requestURL = new URL(e.request.url);
  if (requestURL.hostname === 'api.flickr.com') { // API
    console.info(requestURL.hostname);
    e.respondWith(
      caches.match(e.request)
      .then(response => response || fetch(e.request))
    )
  } else if (/\.staticflickr\.com$/.test(requestURL.hostname)) { // Images
    e.respondWith(
      caches.match(e.request)
      .then(response => response || fetch(e.request))
    )
  } else { // Other assets
    e.respondWith(
      caches.match(e.request)
      .catch(() => e.default())
      .catch(() => caches.match('/fallback.html'))
    );
  }
});
