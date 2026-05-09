/**
 * Absolute URL prefixes removed from scraped HTML so anchors resolve on this deployment.
 * Set NEXT_PUBLIC_MIRROR_ORIGINS (comma-separated full origins, e.g. https://example.com).
 */
export function scrapedMirrorOriginPrefixes(): string[] {
  const fromEnv = process.env.NEXT_PUBLIC_MIRROR_ORIGINS?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (fromEnv?.length) return fromEnv;

  return [
    "https://bobbiedsweettreats.com",
    "http://bobbiedsweettreats.com",
    "https://www.bobbiedsweettreats.com",
    "http://www.bobbiedsweettreats.com",
  ];
}
