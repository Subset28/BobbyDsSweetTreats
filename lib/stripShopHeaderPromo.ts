import { findDivBlockEnd } from "./mergeCanonicalChrome";

/**
 * Non-home routes merge in Home’s full header chrome, which includes the hero row (background
 * image column + Hero column with taglines / CTA). Remove both so shop, cart, account, etc. get a
 * compact header that matches Home’s top bar (logo + utilities + nav) without extra vertical gap.
 */
export function stripShopHeaderPromo(html: string): string {
  let out = html;
  // Large inset image (`figure` / `picture` column).
  out = removeDivBlockContaining(out, 'data-aid="BACKGROUND_IMAGE_RENDERED"');
  // Text + CTA column (`<div data-ux="Hero">` … taglines, quote, Order Now).
  out = removeDivBlockContaining(out, 'data-ux="Hero"');
  // The two-column row wrapper often remains as `Container` > empty `Block`, which still picks up
  // storefront min-height / flex sizing and leaves a large white band under the nav.
  out = removeOrphanedHeroRowContainer(out);
  return out;
}

/** Remove an empty promo-row shell left inside `HEADER_SECTION` after the hero columns are stripped. */
function removeOrphanedHeroRowContainer(html: string): string {
  const marker = 'data-aid="HEADER_SECTION"';
  const secStart = html.indexOf(marker);
  if (secStart === -1) return html;
  const secEnd = html.indexOf("</section>", secStart);
  if (secEnd === -1) return html;
  const section = html.slice(secStart, secEnd);
  const cleaned = section.replace(
    /<div data-ux="Container"[^>]*>\s*<div data-ux="Block"[^>]*>\s*<\/div>\s*<\/div>/g,
    "",
  );
  return html.slice(0, secStart) + cleaned + html.slice(secEnd);
}

function removeDivBlockContaining(html: string, needle: string): string {
  const pos = html.indexOf(needle);
  if (pos === -1) return html;
  const divStart = html.lastIndexOf("<div", pos);
  if (divStart === -1) return html;
  const divEnd = findDivBlockEnd(html, divStart);
  return html.slice(0, divStart) + html.slice(divEnd);
}
