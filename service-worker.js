const CACHE_NAME = "launch-gogogo-pwa-v18";
const THEATER_ASSET_CACHE_NAME = "launch-gogogo-theater-assets-v10";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app-core.js",
  "./app.js",
  "./manifest.json",
  "./icon.svg",
  "./icon-192.png",
  "./icon-512.png",
  "./assets/theater/theater-assets-manifest.json"
];
const CORE_ASSET_URLS = new Set(ASSETS.map((asset) => new URL(asset, self.location.href).href));

async function refreshCachedAsset(cache, asset) {
  const request = new Request(asset, { cache: "reload" });
  const response = await fetch(request);
  if (!response.ok) throw new Error(`Unable to cache ${asset}`);
  await cache.put(asset, response);
}

function shouldFetchFresh(request) {
  return request.mode === "navigate" || CORE_ASSET_URLS.has(request.url);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(ASSETS.map((asset) => refreshCachedAsset(cache, asset)))
    )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys
        .filter((key) => ![CACHE_NAME, THEATER_ASSET_CACHE_NAME].includes(key))
        .map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    (async () => {
      const cached = await caches.match(event.request);
      if (shouldFetchFresh(event.request)) {
        try {
          const response = await fetch(new Request(event.request, { cache: "reload" }));
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        } catch (error) {
          if (cached) return cached;
          throw error;
        }
      }

      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    })()
  );
});
