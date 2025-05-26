// Service Worker básico para New 3DS
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('pokemon-types-v1').then(function(cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/busqueda.html',
                '/estilos.css',
                '/script.js',
                '/busqueda.js',
                '/types.json',
                '/pokedata.json',
                '/sprites/pokelogo.png'
            ]);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});