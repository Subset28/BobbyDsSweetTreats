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
  return out;
}
