import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Detecta prácticas inseguras en React
  swcMinify: true, // Compilación más rápida y ligera

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.qrserver.com", // ✅ para tus QR remotos
      },
      {
        protocol: "http",
        hostname: "localhost", // ✅ si mostrás imágenes generadas en tu API local
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*", // Todas las rutas
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

export default nextConfig;
