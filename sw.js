/* ==========================================
   Neurology Diary
   Service Worker
========================================== */

const CACHE_NAME = "neurology-diary-v1";

const FILES_TO_CACHE = [

    "./",
    "./index.html",

    "./manifest.json",

    "./css/style.css",

    "./js/storage.js",
    "./js/ui.js",
    "./js/app.js",
    "./js/charts.js",
    "./js/statistics.js",
    "./js/report.js",
    "./js/calendar.js"

];

/* Install */

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(cache => cache.addAll(FILES_TO_CACHE))

    );

    self.skipWaiting();

});

/* Activate */

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()

            .then(keys =>

                Promise.all(

                    keys.map(key => {

                        if (key !== CACHE_NAME) {

                            return caches.delete(key);

                        }

                    })

                )

            )

    );

    self.clients.claim();

});

/* Fetch */

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)

            .then(response => {

                return response || fetch(event.request);

            })

    );

});
