
// https://googlechrome.github.io/samples/service-worker/basic/
// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
const PRECACHE = 'miotrekking-cache-v16';
const RUNTIME = 'runtime';

// A list of local resources we always want to be cached.
const assets = [
    //'/css/bootstrap/bootstrap.min.css'
    "/",
    "/index.html",
    "/css/bootstrap.min.css",
    "/css/leaflet.css",
    "/css/images/layers.png",
    "/css/images/layers-2x.png",
    "/css/images/marker-icon.png",
    "/css/images/marker-icon-2x.png",
    "/css/images/marker-shadow.png",
    "/js/bootstrap.bundle.min.js",
    "/js/jquery-3.6.1.min.js",
    "/js/leaflet.js",
    "/js/GPXParser.min.js",
    "/js/pouchdb.js",
    "/js/L.TileLayer.PouchDBCached.js",
    "/images/Spinner-3.gif",
    "/images/icons/icon-48x48.png",
    "/images/icons/icon-64x64.png",
    "/images/icons/icon-72x72.png",
    "/images/icons/icon-96x96.png",
    "/images/icons/icon-128x128.png",
    "/images/icons/icon-144x144.png",
    "/images/icons/icon-152x152.png",
    "/images/icons/icon-192x192.png",
    "/images/icons/icon-384x384.png",
    "/images/icons/icon-512x512.png",
    "/main.js",
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(PRECACHE)
            .then(cache => cache.addAll(assets))
            .then(self.skipWaiting())
    );
});
// self.addEventListener("install", installEvent => {
//     installEvent.waitUntil(
//       caches.open(PRECACHE).then(cache => {
//         cache.addAll(assets)
//       })
//     )
//   })


// self.addEventListener('fetch', function (event) {
//     event.respondWith(
//         caches.match(event.request)
//             .then(function (response) {
//                 // Cache hit - return response
//                 if (response) {
//                     return response;
//                 }
//                 return fetch(event.request);
//             })
//     );
// });
self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })


// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});

