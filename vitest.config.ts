import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@biz11": path.resolve(__dirname, "./src"),
    },
  },
});
