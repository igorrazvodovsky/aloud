import { fileURLToPath, URL } from "node:url";
import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version)
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: "prompt",
      includeAssets: ["img/icons/favicon.ico", "img/icons/apple-touch-icon.png"],
      manifest: {
        name: "Aloud",
        short_name: "Aloud",
        description: "An audiobook player for the LibriVox public-domain collection.",
        theme_color: "#f4f3ef",
        background_color: "#f4f3ef",
        display: "standalone",
        start_url: "./",
        icons: [
          { src: "img/icons/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "img/icons/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "img/icons/android-chrome-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },
      workbox: {
        // Explicit: the old build swept 96 font files (15 MB) into the precache
        // because the default glob matched everything the bundler emitted.
        globPatterns: ["**/*.{js,css,html,woff2}"],
        navigateFallback: "index.html",
        runtimeCaching: [
          {
            // Book metadata: fresh when online, still available offline.
            urlPattern: /^https:\/\/archive\.org\/metadata\//,
            handler: "NetworkFirst",
            options: {
              cacheName: "archive-metadata",
              expiration: { maxEntries: 32, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ]
});
