/**
 * Service Worker for Baby Outlet Admin Portal
 * Enables offline functionality and smart caching strategies
 */

const CACHE_NAME = 'baby-outlet-admin-v1'
const STATIC_CACHE = 'static-v1'
const API_CACHE = 'api-v1'
const IMAGE_CACHE = 'images-v1'

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
]

// API endpoints to cache for offline
const CACHEABLE_APIS = [
  '/api/products',
  '/api/categories',
  '/api/vendors',
  '/api/locations',
]

// Cache strategies
const CACHE_STRATEGIES = {
  // Network first, fallback to cache (for frequently changing data)
  networkFirst: async (request) => {
    try {
      const response = await fetch(request)
      if (response.ok) {
        const cache = await caches.open(API_CACHE)
        cache.put(request, response.clone())
      }
      return response
    } catch (error) {
      const cached = await caches.match(request)
      return cached || createOfflineResponse()
    }
  },

  // Cache first, fallback to network (for static assets)
  cacheFirst: async (request) => {
    const cached = await caches.match(request)
    if (cached) return cached

    try {
      const response = await fetch(request)
      if (response.ok) {
        const cache = await caches.open(STATIC_CACHE)
        cache.put(request, response.clone())
      }
      return response
    } catch (error) {
      return createOfflineResponse()
    }
  },

  // Stale while revalidate (best of both worlds)
  staleWhileRevalidate: async (request) => {
    const cached = await caches.match(request)

    const fetchPromise = fetch(request).then((response) => {
      if (response.ok) {
        const cache = caches.open(STATIC_CACHE)
        cache.then((c) => c.put(request, response.clone()))
      }
      return response
    })

    return cached || fetchPromise
  },
}

/**
 * Install Event - Cache essential assets
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((error) => {
        console.warn('Failed to cache static assets:', error)
        // Don't fail installation if caching fails
      })
    })
  )
})

/**
 * Activate Event - Clean up old caches
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old cache versions
          if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE && cacheName !== IMAGE_CACHE) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

/**
 * Fetch Event - Route requests to appropriate cache strategy
 */
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // API requests: Network first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(CACHE_STRATEGIES.networkFirst(request))
    return
  }

  // Images: Cache first
  if (url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp)$/i)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached

        return fetch(request).then((response) => {
          if (response.ok) {
            const cache = caches.open(IMAGE_CACHE)
            cache.then((c) => c.put(request, response.clone()))
          }
          return response
        })
      })
    )
    return
  }

  // Static assets (JS, CSS): Stale while revalidate
  if (url.pathname.match(/\.(js|css)$/i)) {
    event.respondWith(CACHE_STRATEGIES.staleWhileRevalidate(request))
    return
  }

  // Default: Cache first
  event.respondWith(CACHE_STRATEGIES.cacheFirst(request))
})

/**
 * Message Event - Handle messages from clients
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  // Handle cache clear
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
    })
  }
})

/**
 * Create offline fallback response
 */
function createOfflineResponse() {
  return new Response(
    JSON.stringify({
      success: false,
      message: 'You are currently offline. Please check your connection.',
      offline: true,
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }
  )
}

/**
 * Push Notification Event
 */
self.addEventListener('push', (event) => {
  if (!event.data) return

  const data = event.data.json()
  const options = {
    body: data.body || 'New notification',
    icon: '/logo-192.png',
    badge: '/badge-72.png',
    tag: data.tag || 'notification',
    requireInteraction: data.requireInteraction || false,
  }

  event.waitUntil(self.registration.showNotification(data.title || 'Baby Outlet Admin', options))
})

/**
 * Notification Click Event
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const urlToOpen = event.notification.tag === 'order' ? '/orders' : '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there's already a window open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i]
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus()
        }
      }
      // If not, open a new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    })
  )
})
