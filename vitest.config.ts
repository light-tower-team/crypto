import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      exclude: [...(configDefaults.coverage.exclude ?? []), "scripts/**"],
      provider: "istanbul",
    },
  },
});
