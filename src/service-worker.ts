const cacheName = "duotrigordle-clone-v1";
const assets = [
  "index.html",
  "static/",
  "static/css/",
  "static/css/main.0ddedf10.css",
  "static/js/",
  "static/js/main.db15fb37.js"
];

// eslint-disable-next-line no-restricted-globals
const ignored = (self as any).__WB_MANIFEST;

interface ExtendableEvent extends Event {
  waitUntil(fn: Promise<any>): void;
}

interface Body {
  arrayBuffer(): Promise<ArrayBuffer>;
  blob(): Promise<Blob>;
  formData(): Promise<FormData>;
  json(): Promise<any>;
  text(): Promise<string>;
}

interface FetchEvent extends Event {
  request: Request;
  respondWith(response: Promise<Response> | Response): Promise<Response>;
}

interface InstallEvent extends ExtendableEvent {
  activeWorker: ServiceWorker;
}

// eslint-disable-next-line no-restricted-globals
self.addEventListener("install", (e) => {
  let ev: InstallEvent = e as InstallEvent;

  console.log("Attempting to initiate service worker and cache assets...");
  ev.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(assets)));
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener("fetch", (e) => {
  const ev: FetchEvent = e as FetchEvent;
  console.log("Fetch event for ", ev.request.url);
  ev.respondWith(
    caches
      .match(ev.request)
      .then((response) => {
        if (response) {
          console.log("Found ", ev.request.url, " in cache");
          return response;
        }
        console.log("Network request for ", ev.request.url);
        return fetch(ev.request).then((response) => {
          return caches.open(cacheName).then((cache) => {
            cache.put(ev.request.url, response.clone());
            return response;
          });
        });
      })
      .catch((error) => {
        return new Response(null, {
          status: 404,
          statusText: "Not Cached"
        });
      })
  );
});
