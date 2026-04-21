/**
 * GoDaddy marks the desktop nav wrapper with .c1-14 (display:none) and only
 * reveals it at 1024px+ via .c1-15. Without their JS/hamburger wiring, links
 * disappear on common laptop widths. Drop .c1-14 from the header nav mount only.
 */
const HEADER_NAV_WRAP =
  '<div data-ux="Block" class="x-el x-el-div c1-1 c1-2 c1-14 c1-b c1-c c1-d c1-15 c1-e c1-f c1-g"><nav data-ux="Block"';

const HEADER_NAV_WRAP_FIXED =
  '<div data-ux="Block" class="x-el x-el-div c1-1 c1-2 c1-b c1-c c1-d c1-15 c1-e c1-f c1-g"><nav data-ux="Block"';

export function fixHeaderNavVisibility(html: string): string {
  if (!html.includes(HEADER_NAV_WRAP)) return html;
  return html.replace(HEADER_NAV_WRAP, HEADER_NAV_WRAP_FIXED);
}
