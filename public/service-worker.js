// service-worker.js

// ���� ĳ�� ����� �̸�
const CACHE_NAME = 'moyeoyo-cache-v1';

// ĳ���� ���� ����Ʈ
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  // �ʿ��ϸ� �߰������� CSS, JS ���ϵ� ���⿡ ���
];

// ��ġ(install) �̺�Ʈ - ���� ó�� ��ġ�� ��
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(urlsToCache);
    })
  );
});

// Ȱ��ȭ(activate) �̺�Ʈ - ���ο� ���񽺿�Ŀ Ȱ��ȭ
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

// fetch �̺�Ʈ - ��Ʈ��ũ ��û�� ����ä�� ĳ�ÿ��� ����
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
