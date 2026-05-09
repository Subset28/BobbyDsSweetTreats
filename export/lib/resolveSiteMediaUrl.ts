import fs from "fs";
import path from "path";

type Manifest = Record<string, string>;

let cached: Manifest | null = null;

function getManifest(): Manifest {
  if (!cached) {
    const p = path.join(process.cwd(), "public/site-media/manifest.json");
    cached = JSON.parse(fs.readFileSync(p, "utf8")) as Manifest;
  }
  return cached;
}

function maxWidthScore(key: string): number {
  const wm = key.match(/rs=w:(\d+)/);
  if (wm) return parseInt(wm[1], 10);
  const hm = key.match(/rs=h:(\d+)/);
  if (hm) return parseInt(hm[1], 10);
  return 0;
}

/** Map a canonical img1 base URL (no `/:/` transform suffix) to the best local `/site-media/…` path. */
export function resolveSiteMediaLocalPath(imageBaseHttps: string): string {
  const manifest = getManifest();
  if (manifest[imageBaseHttps]) return manifest[imageBaseHttps];

  let bestKey = "";
  let bestScore = -1;
  for (const key of Object.keys(manifest)) {
    if (key === imageBaseHttps || key.startsWith(`${imageBaseHttps}/:`)) {
      const score = maxWidthScore(key);
      if (score > bestScore) {
        bestScore = score;
        bestKey = key;
      }
    }
  }
  if (bestKey) return manifest[bestKey]!;
  return imageBaseHttps;
}
