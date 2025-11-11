const withPWA = require("@ducanh2912/next-pwa").default;

module.exports = withPWA({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    workboxOptions: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        navigationPreload: true,
        additionalManifestEntries: [
            { url: '/offline-reader', revision: '1.0.0' },
            { url: '/logo.png', revision: '1.0.0' }
        ],
        runtimeCaching: [
            // Never cache auth endpoints
            {
                urlPattern: ({ url }) => {
                    return url.pathname.startsWith('/api/auth') ||
                        url.pathname.startsWith('/auth');
                },
                handler: 'NetworkOnly'
            },

            // Cache Next.js Image Optimization API
            {
                urlPattern: ({ url }) => {
                    return url.pathname.startsWith('/_next/image');
                },
                handler: 'CacheFirst',
                options: {
                    cacheName: 'next-image-cache',
                    expiration: {
                        maxEntries: 200,
                        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
                    },
                    cacheableResponse: {
                        statuses: [0, 200]
                    }
                }
            },

            // Cache Next.js static files
            {
                urlPattern: ({ url }) => {
                    return url.pathname.startsWith('/_next/static/');
                },
                handler: 'CacheFirst',
                options: {
                    cacheName: 'next-static-cache',
                    expiration: {
                        maxEntries: 200,
                        maxAgeSeconds: 365 * 24 * 60 * 60
                    }
                }
            },

            // Cache Next.js data (RSC payloads)
            {
                urlPattern: ({ url }) => {
                    return url.pathname.includes('/_next/data/');
                },
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'next-data-cache',
                    networkTimeoutSeconds: 3,
                    expiration: {
                        maxEntries: 200,
                        maxAgeSeconds: 24 * 60 * 60
                    },
                    cacheableResponse: {
                        statuses: [0, 200]
                    }
                }
            },

            // Cache JavaScript/CSS files
            {
                urlPattern: /\.(?:js|css|woff2?|ttf|otf)$/i,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'static-resources',
                    expiration: {
                        maxEntries: 200,
                        maxAgeSeconds: 30 * 24 * 60 * 60
                    }
                }
            },

            // Cache static images from public folder
            {
                urlPattern: ({ url }) => {
                    return url.pathname.match(/\.(?:png|jpg|jpeg|gif|svg|webp|ico)$/i) &&
                        !url.pathname.startsWith('/_next/');
                },
                handler: 'CacheFirst',
                options: {
                    cacheName: 'public-images-cache',
                    expiration: {
                        maxEntries: 100,
                        maxAgeSeconds: 30 * 24 * 60 * 60
                    }
                }
            },

            // Cache external images (from remote sources)
            {
                urlPattern: ({ url }) => {
                    return url.origin !== self.location.origin &&
                        url.pathname.match(/\.(?:png|jpg|jpeg|gif|svg|webp)$/i);
                },
                handler: 'CacheFirst',
                options: {
                    cacheName: 'external-images-cache',
                    expiration: {
                        maxEntries: 150,
                        maxAgeSeconds: 30 * 24 * 60 * 60
                    },
                    cacheableResponse: {
                        statuses: [0, 200]
                    }
                }
            },

            // Cache HTML pages
            {
                urlPattern: ({ url, request }) => {
                    return request.destination === 'document' ||
                        url.pathname === '/' ||
                        (!url.pathname.includes('.') && !url.pathname.startsWith('/api') && !url.pathname.startsWith('/_next'));
                },
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'pages-cache',
                    networkTimeoutSeconds: 3,
                    expiration: {
                        maxEntries: 100,
                        maxAgeSeconds: 7 * 24 * 60 * 60
                    },
                    cacheableResponse: {
                        statuses: [0, 200]
                    }
                }
            }
        ]
    },
})({
    output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : undefined,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: '**',
                pathname: '/**',
            },
        ],
        minimumCacheTTL: 60,
    }
});