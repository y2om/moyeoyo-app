// service-worker.js

// 파일 캐시 저장소 이름
const CACHE_NAME = 'moyeoyo-cache-v1';

// 캐시할 파일 리스트
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  // 필요하면 추가적으로 CSS, JS 파일도 여기에 등록
];

// 설치(install) 이벤트 - 앱이 처음 설치될 때
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(urlsToCache);
    })
  );
});

// 활성화(activate) 이벤트 - 새로운 서비스워커 활성화
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// fetch 이벤트 - 네트워크 요청을 가로채서 캐시에서 제공
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
