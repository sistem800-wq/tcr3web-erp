/* build-600 MASTER CLEAN */
const TCR3_CACHE_VERSION = '20260715-600';
const STATIC_CACHE = 'tcr3web-static-' + TCR3_CACHE_VERSION;
const RUNTIME_CACHE = 'tcr3web-runtime-' + TCR3_CACHE_VERSION;
const APP_SHELL = './index.html?pwa=1&v=600';
const CORE_ASSETS = [
  './', './index.html', './pages/dashboard.html', './manifest.webmanifest',
  './assets/css/style.css?v=20260717-548',
  './assets/css/mobile-tablet-framework.css?v=20260715-600',
  './assets/css/performance.css?v=20260711-697',
  './assets/js/app.js?v=20260711-697',
  './assets/js/mobile-tablet-framework.js?v=20260715-600',
  './assets/js/master-init.js?v=20260711-697',
  './assets/img/tcr3web-logo-clean.svg',
  './assets/icons/icon-192.png', './assets/icons/icon-512.png'
];
self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(caches.open(STATIC_CACHE).then(function(cache) {
    return Promise.all(CORE_ASSETS.map(function(url){
      return cache.add(url).catch(function(){ return null; });
    }));
  }));
});
self.addEventListener('activate', function(event) {
  event.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k!==STATIC_CACHE && k!==RUNTIME_CACHE;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data && event.data.type === 'CLEAR_CACHES') {
    event.waitUntil(caches.keys().then(function(keys){return Promise.all(keys.map(function(k){return caches.delete(k);}));}));
  }
});
self.addEventListener('fetch', function(event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).then(function(res){
      if (res && res.ok) { caches.open(RUNTIME_CACHE).then(function(c){c.put(req,res.clone());}); }
      return res;
    }).catch(function(){
      return caches.match(req).then(function(hit){
        return hit || caches.match(APP_SHELL).then(function(shell){return shell || caches.match('./index.html');});
      });
    }));
    return;
  }
  event.respondWith(caches.match(req).then(function(cached){
    return cached || fetch(req).then(function(res){
      if (res && res.ok) caches.open(RUNTIME_CACHE).then(function(c){c.put(req,res.clone());});
      return res;
    });
  }));
});
