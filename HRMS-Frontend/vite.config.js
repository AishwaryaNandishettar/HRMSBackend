import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  define: {
    global: "window",
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore specific warnings
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        if (warning.code === 'UNRESOLVED_IMPORT' && warning.message.includes('react-is')) return;
        warn(warning);
      }
    },
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
