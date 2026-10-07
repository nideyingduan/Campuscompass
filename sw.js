/* 校航 PWA - Service Worker（离线缓存）
 * 修改了文件内容后，把下面 CACHE_NAME 的版本号升一位：
 * 小改动只升小版本（如 v2.0 -> v2.1），大改动才升大版本（如 v2.x -> v3.0）。
 * 重新打开页面就会自动更新缓存。
 */
const CACHE_NAME = "Campuscompass-v3.1";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon.svg",
  "./qrcodes/订桶装水.jpg",
  "./qrcodes/物业报修.jpg",
  "./qrcodes/广东医缴费.jpg",
  "./map/map.jpg"
];

/* 安装：逐个缓存静态资源（某个文件缺失不影响其他资源缓存） */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        ASSETS.map((url) => cache.add(url))
      );
    })
  );
  self.skipWaiting();
});

/* 激活：清理旧版本缓存 */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* 请求处理：
 * 页面文件走"网络优先"（先拿最新版，断网才用缓存）→ 保证同学及时看到更新；
 * 其他静态资源走"缓存优先"（省流量，缓存没有再去网络）。 */
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.pathname.endsWith("index.html") || url.pathname === "/") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === "basic") {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
