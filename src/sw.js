importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js"
);

if (workbox) {
  workbox.precaching.precacheAndRoute([]);
  // IMAGES
  workbox.routing.registerRoute(
    /(.*)\.(?:png|gif|jpg|jpeg|ico)/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: "images-cache",
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ],
    })
  );
  // FONTS
  workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: "google-fonts-stylesheets",
    })
  );
}
