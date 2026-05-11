/**
 * GoDaddy vertical shell utilities on `[data-ux="Page"]` (classes like c1-7…c1-a) compile to rules such as
 * `.x .c1-7 > div { margin-top: auto }` on the direct child (`.page-inner`). Combined with `min-height: 100vh`
 * on `.page-inner`, that leaves a large empty band above the footer on merged membership pages. Strip only
 * those single-token utilities from the Page root’s `class` attribute (see `app/storefront.css` c1-5…c1-a).
 */
export function relaxScrapedPageShellStretch(html: string): string {
  const needle = 'data-ux="Page"';
  const i = html.indexOf(needle);
  if (i === -1) return html;

  const open = html.lastIndexOf("<div", i);
  if (open === -1) return html;

  const close = html.indexOf(">", i);
  if (close === -1 || close < open) return html;

  const tag = html.slice(open, close + 1);
  const classMatch = tag.match(/\sclass="([^"]*)"/i);
  if (!classMatch) return html;

  const cls = classMatch[1];
  const next = cls
    .replace(/\bc1-[56789a]\b/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  if (next === cls) return html;

  const newTag = tag.replace(
    /\sclass="[^"]*"/i,
    next.length ? ` class="${next}"` : "",
  );

  return html.slice(0, open) + newTag + html.slice(close + 1);
}
