// Service Worker for Barrett Taylor Portfolio

const CACHE_NAME = 'barrett-taylor-portfolio-v1.1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/main.js',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/favicon-16x16.png',
  '/icons/favicon-32x32.png',
  '/icons/apple-touch-icon.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-brands-400.woff2',
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap'
];

// Install event - caching assets with improved error handling
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching all assets');
        // Use cache.addAll with Promise.allSettled to handle partial failures
        return Promise.allSettled(
          ASSETS_TO_CACHE.map(url => {
            return cache.add(url).catch(error => {
              console.warn(`[Service Worker] Failed to cache: ${url}`, error);
              return null; // Continue with other assets if one fails
            });
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Installation complete');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[Service Worker] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if