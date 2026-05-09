/**
 * The export marks the desktop nav wrapper with .c1-14 (display:none) and only
 * reveals it at 1024px+ via .c1-15. Without their JS/hamburger wiring, links
 * disappear on common laptop widths. Drop .c1-14 from the header nav mount only.
 */
const HEADER_NAV_WRAP =
  '<div data-ux="Block" class="x-el x-el-div c1-1 c1-2 c1-14 c1-b c1-c c1-d c1-15 c1-e c1-f c1-g"><nav data-ux="Block"';

const HEADER_NAV_WRAP_FIXED =
  '<div data-ux="Block" class="x-el x-el-div c1-1 c1-2 c1-b c1-c c1-d c1-15 c1-e c1-f c1-g"><nav data-ux="Block"';

/** Desktop primary logo row (Header 9). */
const DESKTOP_LOGO_WRAP =
  '<div data-ux="Block" class="x-el x-el-div c1-1 c1-2 c1-1f c1-1g c1-1h c1-b c1-c c1-d c1-e c1-f c1-g"><div data-ux="Block" data-aid="HEADER_LOGO_RENDERED"';

const DESKTOP_LOGO_WRAP_MARKED =
  '<div data-ux="Block" class="x-el x-el-div c1-1 c1-2 c1-1f c1-1g c1-1h c1-b c1-c c1-d c1-e c1-f c1-g" data-bst-header-logo="desktop"><div data-ux="Block" data-aid="HEADER_LOGO_RENDERED"';

/** Compact-row duplicate logo (next to hamburger). Re-scrape may change `c1-*` tokens; update strings here if both logos show again. */
const COMPACT_LOGO_WRAP =
  '<div data-ux="Block" class="x-el x-el-div c1-1 c1-2 c1-6j c1-1g c1-19 c1-b c1-c c1-d c1-e c1-f c1-g"><div data-ux="Block" data-aid="HEADER_LOGO_RENDERED"';

const COMPACT_LOGO_WRAP_MARKED =
  '<div data-ux="Block" class="x-el x-el-div c1-1 c1-2 c1-6j c1-1g c1-19 c1-b c1-c c1-d c1-e c1-f c1-g" data-bst-header-logo="compact"><div data-ux="Block" data-aid="HEADER_LOGO_RENDERED"';

function markHeaderLogoSlots(html: string): string {
  if (html.includes("data-bst-header-logo=")) return html;
  let out = html;
  if (out.includes(DESKTOP_LOGO_WRAP)) {
    out = out.replace(DESKTOP_LOGO_WRAP, DESKTOP_LOGO_WRAP_MARKED);
  }
  if (out.includes(COMPACT_LOGO_WRAP)) {
    out = out.replace(COMPACT_LOGO_WRAP, COMPACT_LOGO_WRAP_MARKED);
  }
  return out;
}

export function fixHeaderNavVisibility(html: string): string {
  let out = html;
  if (out.includes(HEADER_NAV_WRAP)) {
    out = out.replace(HEADER_NAV_WRAP, HEADER_NAV_WRAP_FIXED);
  }
  out = markHeaderLogoSlots(out);
  return out;
}
