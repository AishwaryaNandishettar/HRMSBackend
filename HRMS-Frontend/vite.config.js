import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
   base: "/", // ✅ ADD THIS LINE
  plugins: [react()],
  define: {
    global: "window", // ✅ FIX for sockjs-client
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
