const CACHE = "V4";
const URLS = [
    "./",
  "index.html",
  "./css/style.css",
  "./js/app.js",
  "log.html",
  "./resources/home.html",
  "./images/icons/icon-32x32.png",
  "./images/icons/icon-64x64.png",
  "./images/icons/icon-96x96.png",
  "./images/icons/icon-128x128.png",
  "./images/icons/icon-192x192.png",
  "./images/icons/icon-256x256.png",
  "./images/icons/icon-512x512.png",
  "contacts.html"
];

let logFromSw = [];
function myLog(e) {
    logFromSw.push(e)
}
myLog("CACHE V4"),
self.addEventListener("install", e=>{
    myLog("Service Worker installing"),
    self.skipWaiting(),
    e.waitUntil(caches.open("V4").then(e=>e.addAll(URLS)))
}
),
self.addEventListener("activate", e=>{
    e.waitUntil(caches.keys().then(e=>Promise.all(e.map(e=>{
        if ("V4" !== e)
            return myLog(`Deleting cache ${e}`),
            caches.delete(e)
    }
    ))).then(()=>(myLog("SW is activate and now ready to handle fetches!"),
    self.clients.claim())))
}
),
self.addEventListener("fetch", e=>{
    if (e.request.url.endsWith("log.html")) {
        const n = {
            status: 200,
            headers: {
                "Content-type": "text/html"
            }
        };
        let o = new Response(JSON.stringify(logFromSw),n);
        logFromSw = [],
        e.respondWith(o)
    } else
        e.respondWith(caches.match(e.request).then(n=>n ? (myLog(e.request.url + " from caches"),
        n) : (myLog(e.request.url + " from server"),
        fetch(e.request).then(n=>("error" !== n.type && caches.open("V4").then(o=>o.put(e.request, n)),
        n.clone())))))
}
);
