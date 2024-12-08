import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "manifest.json",
          dest: "./",
        },
        {
          src: "LICENSE",
          dest: "./",
        },
      ],
    }),
  ],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, "./index.html"),
        options: path.resolve(__dirname, "./options.html"),
        background: path.resolve(__dirname, "./src/background.ts"),
        inject: path.resolve(__dirname, "./src/inject.ts"),
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
  resolve: {
    alias: {
      "@": `${path.resolve(__dirname, "src")}`,
    },
  },
});
