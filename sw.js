const C = 'tareas-5.3';
const A = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => e.waitUntil(
  caches.open(C).then(c => c.addAll(A.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting())
));
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
// Con conexión: versión más nueva, pero solo se guarda y se usa si la respuesta es correcta (no un error 404).
// Sin conexión o con error: la copia guardada.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' })
      .then(r => {
        if (!r.ok) return caches.match(e.request).then(m => m || r);
        const copy = r.clone(); caches.open(C).then(c => c.put(e.request, copy));
        return r;
      })
      .catch(() => caches.match(e.request))
  );
});
