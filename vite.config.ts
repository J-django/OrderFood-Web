import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig, loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { resolve } from "node:path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
      VitePWA({
        injectRegister: "auto",
        registerType: "autoUpdate",
        devOptions: { enabled: true },
        includeAssets: ["pwa-icon.svg", "pwa-icon-192.png", "pwa-icon-512.png"],
        manifest: {
          id: "/",
          name: "饭香香",
          short_name: "饭香香",
          description: "家庭共享美食应用",
          lang: "zh-CN",
          start_url: "/",
          scope: "/",
          display: "standalone",
          orientation: "portrait",
          background_color: "#f6f6f6",
          theme_color: "#ff5f15",
          icons: [
            {
              src: "/pwa-icon-192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "/pwa-icon-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
        workbox: {
          navigateFallback: "/index.html",
          globPatterns: ["**/*.{js,css,html,svg,woff2}"],
        },
      }),
    ],

    resolve: {
      alias: { "@": resolve(import.meta.dirname, "src") },
    },

    server: {
      host: true,
      open: true,
      proxy: {
        "/api": {
          target: env.VITE_API_PROXY_TARGET,
          changeOrigin: true,
        },
      },
    },
  };
});
