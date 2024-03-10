var cacheName = "after-school-app-v1";
var cacheFiles = [
    "index.html",
    //"products.js",
    "images/afterschool_64x64.png",
    "images/afterschool_512x512.png",
    "images/screenshot1.png",
    "images/screenshot2.png",
];
self.addEventListener('install', (event) => {
    // Perform installation steps
    event.waitUntil(
        caches.open(cacheName)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(cacheFiles);
            })
    );
});

self.addEventListener("fetch", function (e) {
    console.log("[Service Worker] Fetching", e.request.url);
    e.respondWith(
        caches.match(e.request).then(function (response) {
            if (response) {
                console.log("[Service Worker] Found in cache", e.request.url);
                return response;
            }
            var requestClone = e.request.clone();
            return fetch(requestClone)
                .then(function (response) {
                    if (!response) {
                        console.log("[Service Worker] No response from fetch");
                        return response;
                    }
                    var responseClone = response.clone();
                    if (e.request.url.startsWith('http') || e.request.url.startsWith('https')) {
                        caches.open(cacheName).then(function (cache) {
                            cache.put(e.request, responseClone);
                        });
                    }
                    return response;
                }).catch(function (error) {
                    console.error('[Service Worker] Fetch Error', error);
                });
        })
    );
});
// Activate event listener
self.addEventListener('activate', async (event) => {
    const cacheWhitelist = [cacheName];

    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames.map(async (cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
                await caches.delete(cacheName);
            }
        })
    );
});