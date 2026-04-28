import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/", // ✅ ADD THIS LINE
  plugins: [react()],
  define: {
    global: "window", // ✅ FIX for sockjs-client
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress warnings during build
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        warn(warning);
      }
    },
    // Ignore linting errors during build
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5176,
    proxy: {
      "/api": {
        target: "http://localhost:8082",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
