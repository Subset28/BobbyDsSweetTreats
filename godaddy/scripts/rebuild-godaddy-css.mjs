/**
 * Rebuild app/godaddy-all.css from the live homepage <head> only.
 * Do not merge other routes: GoDaddy reuses c1-* tokens with different meanings per page.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outFile = path.join(root, "app", "godaddy-all.css");
const url = "https://bobbiedsweettreats.com/";

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
