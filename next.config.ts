import withPWA from "next-pwa";
import runtimeCaching from "next-pwa/cache";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" }, // QR locales
      { protocol: "https", hostname: "api.qrserver.com" }, // QR externos
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*", // todas las rutas
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

// Configuración específica de PWA
const pwaConfig = {
  dest: "public", // obligatorio
  disable: process.env.NODE_ENV === "development", // deshabilitado en dev
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    // Cachear página /abonos/:id
    {
      urlPattern: /^\/abonos\/\d+$/,
      handler: "NetworkFirst",
      options: {
        cacheName: "abonos-cache",
        expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 }, // 1 día
      },
    },
    // Cachear QR generados
    {
      urlPattern: /^\/qrs\/.*\.png$/,
      handler: "CacheFirst",
      options: {
        cacheName: "qr-cache",
        expiration: { maxEntries: 100, maxAgeSeconds: 7 * 24 * 60 * 60 }, // 7 días
      },
    },
    // Mantener cache estándar de assets (JS, CSS, etc.)
    ...runtimeCaching,
  ],
};

// Exportamos combinando NextConfig + PWAConfig
export default withPWA({
  ...nextConfig,
  ...pwaConfig,
});
