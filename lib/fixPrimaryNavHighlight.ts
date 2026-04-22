export type PrimaryNavHighlight = "home" | "shop" | "none";

const NAV_START = '<nav data-ux="Nav" data-aid="HEADER_NAV_RENDERED"';

function setHrefUx(
  navHtml: string,
  href: string,
  ux: "NavLink" | "NavLinkActive",
): string {
  const esc = href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // `data-ux` may appear before or after `href` on the same opening <a> tag.
  const dataFirst = new RegExp(
    `(<a)([^>]*?)data-ux="(?:NavLink|NavLinkActive)"([^>]*href="${esc}"[^>]*>)`,
  );
  const withDataFirst = navHtml.replace(dataFirst, `$1$2data-ux="${ux}"$3`);
  if (withDataFirst !== navHtml) return withDataFirst;
  const hrefFirst = new RegExp(
    `(<a)([^>]*href="${esc}"[^>]*?)data-ux="(?:NavLink|NavLinkActive)"([^>]*>)`,
  );
  return navHtml.replace(hrefFirst, `$1$2data-ux="${ux}"$3`);
}

/** Align primary Home / Shop `data-ux` with the current route (canonical chrome is always “home active”). */
export function fixPrimaryNavHighlight(
  html: string,
  mode: PrimaryNavHighlight,
): string {
  const navStart = html.indexOf(NAV_START);
  if (navStart === -1) return html;
  const navEnd = html.indexOf("</nav>", navStart);
  if (navEnd === -1) return html;

  const before = html.slice(0, navStart);
  let nav = html.slice(navStart, navEnd + 6);
  const after = html.slice(navEnd + 6);

  if (mode === "home") {
    nav = setHrefUx(nav, "/", "NavLinkActive");
    nav = setHrefUx(nav, "/shop", "NavLink");
  } else if (mode === "shop") {
    nav = setHrefUx(nav, "/", "NavLink");
    nav = setHrefUx(nav, "/shop", "NavLinkActive");
  } else {
    nav = setHrefUx(nav, "/", "NavLink");
    nav = setHrefUx(nav, "/shop", "NavLink");
  }

  return before + nav + after;
}
