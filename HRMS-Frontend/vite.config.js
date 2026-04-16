import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    global: "window", // ✅ FIX for sockjs-client
  },
  server: {
    port: 5176,
    host: true, // ✅ Allow external access
    allowedHosts: [
      'localhost',
      '.ngrok-free.dev',
      '.ngrok.io',
      '.ngrok.app',
      'trowel-eldercare-scouting.ngrok-free.dev'
    ],
    proxy: {
      "/api": {
        target: `${process.env.VITE_API_BASE_URL}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
