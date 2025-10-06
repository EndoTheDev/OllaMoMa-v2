/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./test/setup/vitest.setup.ts"],
    include: ["test/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: [
        "app/composables/**/*.ts",
        "app/components/**/*.{ts,vue}",
        "app/pages/**/*.{ts,vue}",
        "app/stores/**/*.ts",
        "app/types/**/*.ts",
        "server/**/*.ts",
        "app/utils/**/*.ts",
      ],
      exclude: [
        "node_modules/**",
        "test/**",
        "**/*.d.ts",
        "**/*.test.ts",
        "**/*.spec.ts",
        ".nuxt/**",
        ".output/**",
        "dist/**",
      ],
      all: true,
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./app", import.meta.url)),
      "@": fileURLToPath(new URL("./app", import.meta.url)),
      "#imports": fileURLToPath(
        new URL("./test/setup/nuxt-imports.ts", import.meta.url)
      ),
      "#app": fileURLToPath(
        new URL("./test/setup/nuxt-app.ts", import.meta.url)
      ),
    },
  },
});
