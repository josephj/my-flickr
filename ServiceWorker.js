var CACHE_VERSION = 2;
var CURRENT_CACHES = {static: 'static-v' + CACHE_VERSION};

this.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open('static-v' + CACHE_VERSION).then(function (cache) {
      return cache.add(
        '/favicon.ico',
        '/public/index.html',
        '/public/ServiceWorker.js',
        '/static/',
        '/static/js/main.*.js',
        '/static/css/main.*.css'
      )
    })
  );
});

this.addEventListener('fetch', (e) => {
  var requestURL = new URL(e.request.url);

  if (requestURL.hostname === 'api.flickr.com') { // API
    e.respondWith(flickrAPIResponse(event.request));
  } else if (/\.staticflickr\.com$/.test(requestURL.hostname)) { // Images
    event.respondWith(flickrImageResponse(e.request));
  } else { // Other assets
    e.respondWith(
      caches
        .match(e.request)
        .catch(() => e.default())
        .catch(() => caches.match('/fallback.html'))
    );
  }
});

function flickrAPIResponse(request) {
  if (request.header.has('x-has-cache')) {
    return caches.match(request);
  } else {
    caches
      .delete('content')
      .then(() => caches.create('content'))
      .then((contentCache) => {
        contentCache.add(request);
        return fetch(request);
      });
  }
}

function flickrImageResponse(request) {
  return caches.match(request).catch(() => {
    return caches.get('content')
      .then((cache) => {
        cache.add(request);
        return fetch(request);
      });
  })
}
