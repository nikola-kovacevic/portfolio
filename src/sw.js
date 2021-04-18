importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js"
);

if (workbox) {
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

  workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: "google-fonts-stylesheets",
    })
  );

  workbox.routing.registerRoute(
    ({ url }) =>
      url.origin === "https://kovacevic.dev" ||
      url.origin === "https://www.kovacevic.dev",
    new workbox.strategies.CacheFirst({
      cacheName: "requests-cache",
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200],
        }),
      ],
    })
  );
}
