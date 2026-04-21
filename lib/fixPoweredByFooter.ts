/** Replace GoDaddy “Powered by” badge with Code4Community attribution. */
const POWERED_BLOCK =
  /<p([^>]*data-aid="FOOTER_POWERED_BY_AIRO_RENDERED"[^>]*)><span>Powered by <\/span><\/p><a[^>]*data-aid="FOOTER_POWERED_BY_AIRO_RENDERED_LINK"[^>]*>[\s\S]*?<\/a>/g;

const C4C_HREF = "https://code4community.net";
const C4C_TEXT = "code4community";

/** Public file is `c4c logo.webp` */
const C4C_LOGO_SRC = "/c4c%20logo.webp";

export function fixPoweredByFooter(html: string): string {
  return html.replace(
    POWERED_BLOCK,
    `<p$1><span>Powered by </span><a rel="noopener noreferrer" role="link" target="_blank" href="${C4C_HREF}" data-typography="LinkAlpha" class="x-el x-el-a c1-1q c1-1r c1-1s c1-1t c1-1u c1-1v c1-1w c1-b c1-bk c1-c c1-22 c1-du c1-dv c1-d c1-e c1-f c1-g" style="display:inline-flex;align-items:center;gap:6px;vertical-align:middle;line-height:1.2"><img src="${C4C_LOGO_SRC}" alt="" width="131" height="20" style="height:20px;width:auto;max-width:min(131px,38vw);display:block;flex-shrink:0" loading="lazy" decoding="async" /><span>${C4C_TEXT}</span></a></p>`,
  );
}
