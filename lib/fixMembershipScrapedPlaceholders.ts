/**
 * Scraped markup may include placeholder “logged in” header menus (filler email, etc.).
 * Strip obvious filler text; visibility is controlled via globals CSS + optional Supabase session.
 */
export function fixMembershipScrapedPlaceholders(html: string): string {
  let out = html.replace(/filler@[a-z0-9.-]+\.[a-z]{2,}/gi, "");
  out = out.replace(
    /<p([^>]*data-aid="MEMBERSHIP_EMAIL_ADDRESS"[^>]*)>[^<]*<\/p>/gi,
    "<p$1></p>",
  );
  /* Storefront BodyAlpha maps c1-9b → line-through on this promo line; strip the class at source. */
  out = out.replace(
    /<p([^>]*data-aid="MEMBERSHIP_REQUEST_ACCESS_REND"[^>]*class=")([^"]*)(")/gi,
    (_m, pre: string, cls: string, post: string) => {
      const next = cls
        .replace(/\bc1-9b\b/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();
      return `<p${pre}${next}${post}`;
    },
  );
  return out;
}
