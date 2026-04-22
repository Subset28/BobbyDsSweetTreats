/** Stable widget ids shared across all scraped inner bodies. */
export const HEADER_WIDGET_OPEN = '<div id="2c160395-bee0-4923-82b6-fb1a6a09d6d7"';
export const FOOTER_WIDGET_OPEN = '<div id="16139617-9d2e-4c34-b754-de6a9df914c7"';

/** First `<div` at `openDivStart` must be the widget root. Returns index after its closing `</div>`. */
export function findDivBlockEnd(html: string, openDivStart: number): number {
  let i = html.indexOf(">", openDivStart) + 1;
  let depth = 1;
  while (i < html.length && depth > 0) {
    const open = html.indexOf("<div", i);
    const close = html.indexOf("</div>", i);
    if (close === -1) {
      throw new Error("mergeCanonicalChrome: unbalanced </div> while scanning widget");
    }
    if (open !== -1 && open < close) {
      depth++;
      i = open + 4;
    } else {
      depth--;
      i = close + 6;
    }
  }
  return i;
}

/**
 * Use the same header + outer shell + footer as `canonicalFull` (typically fully processed home),
 * but keep the main column from `pageFull` (between the two widgets).
 */
export function mergeCanonicalChrome(canonicalFull: string, pageFull: string): string {
  const ch0 = canonicalFull.indexOf(HEADER_WIDGET_OPEN);
  const ph0 = pageFull.indexOf(HEADER_WIDGET_OPEN);
  const pf0 = pageFull.indexOf(FOOTER_WIDGET_OPEN);
  const cf0 = canonicalFull.indexOf(FOOTER_WIDGET_OPEN);

  if (ch0 === -1 || ph0 === -1 || pf0 === -1 || cf0 === -1) {
    throw new Error(
      "mergeCanonicalChrome: missing header or footer widget id in canonical or page HTML",
    );
  }

  const ch1 = findDivBlockEnd(canonicalFull, ch0);
  const ph1 = findDivBlockEnd(pageFull, ph0);

  const prefix = canonicalFull.slice(0, ch1);
  const main = pageFull.slice(ph1, pf0);
  const suffix = canonicalFull.slice(cf0);

  return prefix + main + suffix;
}
