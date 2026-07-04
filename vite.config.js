import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about.html"),
        projects: resolve(__dirname, "projects.html"),
        contact: resolve(__dirname, "contact.html"),
        roadmap: resolve(__dirname, "roadmap.html"),
      },
    },
  },
});
