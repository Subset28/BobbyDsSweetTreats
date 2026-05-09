/** Menu widget ships a default footnote paragraph; remove it from output. */
const MENU_FOOTNOTE_P =
  /<p data-ux="DetailsMinor" data-aid="MENU_SECTION_FOOTNOTE_RENDERED"[^>]*>[\s\S]*?<\/p>/g;

export function fixRemoveMenuFootnotePlaceholder(html: string): string {
  return html.replace(MENU_FOOTNOTE_P, "");
}
