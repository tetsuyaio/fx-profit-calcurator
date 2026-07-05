import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const distDir = resolve("dist");
const indexPath = resolve(distDir, "index.html");

let html = readFileSync(indexPath, "utf8");

html = html.replace(
  /<link rel="stylesheet" crossorigin href="\.\/([^"]+)">/,
  (_, assetPath) => {
    const css = readFileSync(resolve(distDir, assetPath), "utf8");
    return `<style>\n${css}\n</style>`;
  },
);

html = html.replace(
  /<script type="module" crossorigin src="\.\/([^"]+)"><\/script>/,
  (_, assetPath) => {
    const js = readFileSync(resolve(distDir, assetPath), "utf8");
    return `<script>\nwindow.addEventListener("DOMContentLoaded", () => {\n${js}\n});\n</script>`;
  },
);

writeFileSync(indexPath, html);
