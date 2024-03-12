import * as esbuild from "esbuild";

await esbuild.build({
  outdir: "dist",
  entryPoints: ["common", "srp", "auk"].map((module) => ({ in: `./src/${module}/index.ts`, out: module })),
  platform: "neutral",
  target: "es2020",
  bundle: true,
  write: true,
  minify: true,
});
