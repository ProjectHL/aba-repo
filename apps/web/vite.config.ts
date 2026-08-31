import fs from "node:fs"
import path from "path"
import { sites } from "@openai/sites-vite-plugin"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

const hostingConfigPath = path.resolve(import.meta.dirname, ".openai/hosting.json")

// https://vite.dev/config/
export default defineConfig({
  plugins: [...(fs.existsSync(hostingConfigPath) ? [sites()] : []), react(), tailwindcss()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
})
