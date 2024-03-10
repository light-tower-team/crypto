import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import fg from "fast-glob";

const files = fg.sync(["src/**/!(*.spec|*.d).ts", "!src/**/__tests__/**/*", "!src/**/__mocks__/**/*"]).map((file) => {
  const [key] = file.match(/(?<=src\/).*(?=\.ts)/) ?? [];

  return [key, file];
});

const entries = Object.fromEntries(files);

export default defineConfig({
  build: {
    lib: {
      entry: entries,
      formats: ["es"],
    },
  },
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: "node",
  },
});
