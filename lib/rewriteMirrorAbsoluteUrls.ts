import { scrapedMirrorOriginPrefixes } from "./scrapedMirrorOrigins";

/** Strip known mirror origins from raw HTML so navigation works before client JS runs. */
export function rewriteMirrorAbsoluteUrls(html: string): string {
  let out = html;
  for (const prefix of scrapedMirrorOriginPrefixes()) {
    if (!prefix) continue;
    const esc = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(esc, "gi"), "");
  }
  return out;
}
