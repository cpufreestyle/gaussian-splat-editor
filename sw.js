var version = "1.0.0";

const cacheName = `superSplat-v${version}`;
const isLocal = ['localhost', '127.0.0.1', '::1'].includes(new URL(self.location.href).hostname);
const cacheUrls = [
    './',
    './index.css',
    './index.html',
    './index.js',
    './index.js.map',
    './manifest.json',
    './static/icons/logo-192.png',
    './static/icons/logo-512.png',
    './static/images/screenshot-narrow.jpg',
    './static/images/screenshot-wide.jpg',
    './static/lib/lodepng/lodepng.js',
    './static/lib/lodepng/lodepng.wasm',
    './static/lib/webp/webp.mjs',
    './static/lib/webp/webp.wasm',
    './static/locales/de.json',
    './static/locales/en.json',
    './static/locales/fr.json',
    './static/locales/ja.json',
    './static/locales/ko.json',
    './static/locales/zh-CN.json'
];
self.addEventListener('install', (event) => {
    console.log(`installing v${version}`);
    if (isLocal) {
        event.waitUntil(self.skipWaiting());
        return;
    }
    // create cache for current version
    event.waitUntil(caches.open(cacheName)
        .then((cache) => {
        return cache.addAll(cacheUrls);
    }));
});
self.addEventListener('activate', (event) => {
    console.log(`activating v${version}`);
    if (isLocal) {
        event.waitUntil(caches.keys()
            .then(names => Promise.all(names.map(name => caches.delete(name))))
            .then(() => self.registration.unregister()));
        return;
    }
    // delete the old caches once this one is activated
    event.waitUntil(caches.keys()
        .then(names => Promise.all(names
        .filter(name => name !== cacheName)
        .map(name => caches.delete(name))))
        .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
    if (isLocal) {
        event.respondWith(fetch(event.request));
        return;
    }
    event.respondWith(caches.match(event.request)
        .then(response => response ?? fetch(event.request)));
});
//# sourceMappingURL=sw.js.map
