import { findDivBlockEnd } from "./mergeCanonicalChrome";

/**
 * The shop page reuses the home page header from `mergeCanonicalChrome`, which includes
 * the full home hero row: background image column + Hero column (taglines, quote, CTA).
 * Remove both columns so none of that markup ships on /shop.
 */
export function stripShopHeaderPromo(html: string): string {
  let out = html;
  // Large inset image (`figure` / `picture` column).
  out = removeDivBlockContaining(out, 'data-aid="BACKGROUND_IMAGE_RENDERED"');
  // Text + CTA column (`<div data-ux="Hero">` … taglines, quote, Order Now).
  out = removeDivBlockContaining(out, 'data-ux="Hero"');
  return out;
}

function removeDivBlockContaining(html: string, needle: string): string {
  const pos = html.indexOf(needle);
  if (pos === -1) return html;
  const divStart = html.lastIndexOf("<div", pos);
  if (divStart === -1) return html;
  const divEnd = findDivBlockEnd(html, divStart);
  return html.slice(0, divStart) + html.slice(divEnd);
}
