/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import md5 from "md5";
import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, CacheFirst } from "workbox-strategies";
import { set, get, createStore } from "idb-keyval";

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }: { request: Request; url: URL }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== "navigate") {
      return false;
    }

    // If this is a URL that starts with /_, skip.
    if (url.pathname.startsWith("/_")) {
      return false;
    }

    // If this looks like a URL for a resource, because it contains
    // a file extension, skip.
    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    }

    // Return true to signal that we want to use the handler.
    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + "/index.html"),
);

// Cache any retrieved JSON files, to be accessible again during offline mode
registerRoute(
  ({ url }) => {
    if (url.origin === self.location.origin && url.pathname.endsWith(".json")) {
      return true;
    }
  },
  new CacheFirst({
    cacheName: "assetsJSON",
  }),
);

// Cache any retrieved dotLottie files, to be accessible again during offline mode
registerRoute(
  ({ url }) => {
    if (
      url.origin === self.location.origin &&
      url.pathname.endsWith(".lottie")
    ) {
      return true;
    }
  },
  new CacheFirst({
    cacheName: "assetsLottie",
  }),
);

// Cache any PNG file that's being used for the web styling
registerRoute(
  // Add in any other file extensions or routing criteria as needed.
  ({ url }) =>
    (url.origin === self.location.origin ||
      url.origin.includes("lottiefiles.com")) &&
    url.pathname.endsWith(".png"),
  // Customize this strategy as needed, e.g., by changing to CacheFirst.
  new StaleWhileRevalidate({
    cacheName: "images",
    plugins: [
      // Ensure that once this runtime cache reaches a maximum size the
      // least-recently used images are removed.
      new ExpirationPlugin({ maxEntries: 100 }),
    ],
  }),
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Any other custom service worker logic can go here.

// Cache GraphQL API
const store = createStore("lottieGraphQL", "PostResponses");
self.addEventListener("fetch", (ev) => {
  const request = ev.request;
  const { url, method } = request;
  const validateUrl = new RegExp("/graphql(/)?");
  if (validateUrl.test(url) && method === "POST") {
    ev.respondWith(cacheGraphQLResponse(ev));
  }
});

// Using the strategy "Network First", to retrieve the latest data from the API.
// If the connection is offline or not responding, fallback to cache.
async function cacheGraphQLResponse(event: FetchEvent) {
  return fetch(event.request.clone())
    .then((response) => {
      setGraphQLCache(event.request.clone(), response.clone());
      return response;
    })
    .catch(async (err) => {
      const cache = await getGraphQLCache(event.request.clone());
      // If there's no cache, throw the error to the client to preserve the natural behavior
      if (cache) {
        return cache;
      } else {
        throw err;
      }
    }) as Promise<Response>;
}

async function serializeResponse(response: Response) {
  const serializedHeaders: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    serializedHeaders[key] = value;
  });
  const serialized = {
    headers: serializedHeaders,
    status: response.status,
    statusText: response.statusText,
    body: await response.json(),
  };
  return serialized;
}

async function setGraphQLCache(request: Request, response: Response) {
  const body = await request.json();
  // Only cache query requests. Do not cache mutation requests.
  if (!(body.query as string).startsWith("query")) {
    return;
  }
  const id = md5(body.query + JSON.stringify(body.variables)).toString();

  var entry = {
    query: body.query,
    response: await serializeResponse(response),
    timestamp: Date.now(),
  };
  set(id, entry, store);
}

async function getGraphQLCache(request: Request) {
  try {
    const body = await request.json();
    const id = md5(body.query + JSON.stringify(body.variables)).toString();
    const data = await get(id, store);
    if (!data) {
      return null;
    }

    // Check cache max age.
    const cacheControl = request.headers.get("Cache-Control");
    const maxAge = cacheControl ? parseInt(cacheControl.split("=")[1]) : 3600;
    if (Date.now() - data.timestamp > maxAge * 1000) {
      return null;
    }

    return new Response(JSON.stringify(data.response.body), data.response);
  } catch (err) {
    return null;
  }
}
