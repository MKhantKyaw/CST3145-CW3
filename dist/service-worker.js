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
            })
    );
});

// Fetch event listener
// Fetch event listener
self.addEventListener('fetch', (event) => {
    event.respondWith(async function () {
        const cache = await caches.open(cacheName);
        let response = await cache.match(event.request);

        // Return response from cache if found
        if (response) {
            return response;
        }

        // Otherwise, fetch from network and cache
        response = await fetch(event.request);

        // Check if valid response received
        if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
        }

        // A valid response needs to be cloned before it can be put to a cache.
        let responseToCache = response.clone();

        // Put the fetched response in the cache
        await cache.put(event.request, responseToCache);

        return response;
    }());
});

// Activate event listener
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [cacheName];

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});