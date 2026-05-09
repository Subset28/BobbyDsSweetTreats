/**
 * Optional: rebuild `<head>` inline styles from a source homepage into export/cache/.
 * Set SOURCE_SITE_URL (e.g. https://example.com/). Remote `c1-*` tokens differ per route — only merge one page.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const exportRoot = path.join(__dirname, "..");
const cacheDir = path.join(exportRoot, "cache");
const outFile = path.join(cacheDir, "rebuilt-head-styles.css");

const url = process.env.SOURCE_SITE_URL?.trim();
if (!url) {
  console.error("Set SOURCE_SITE_URL to rebuild (e.g. SOURCE_SITE_URL=https://example.com node export/scripts/rebuild-head-styles.mjs)");
  process.exit(1);
}

fs.mkdirSync(cacheDir, { recursive: true });

const res = await fetch(url);
if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
const html = await res.text();
const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
if (!headMatch) throw new Error("No <head> in response");
const head = headMatch[1];
const blocks = [...head.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(
  (m) => m[1].trim(),
);
let combined = blocks.filter(Boolean).join("\n\n");
combined = combined.replace(
  /opacity:\s*0;\s*\n\s*\n\.carousel/s,
  "opacity: 0;\n}\n\n.carousel",
);
combined = combined.replace(/\{\[object -object\]:0px\}/g, "{}");

fs.writeFileSync(outFile, combined, "utf8");
console.log(`Wrote ${outFile} (${blocks.length} style blocks, ${combined.length} chars)`);
