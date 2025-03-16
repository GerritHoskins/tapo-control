import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',	
  plugins: [vue()],
  server: {
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Adjust to match your backend
        changeOrigin: true, // Ensure requests are forwarded correctly
        rewrite: (path) => path.replace(/^\/api/, ""), // Optional: Strip `/api` if needed
      },
    },
  },
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false, // Add this flag
  },
});
