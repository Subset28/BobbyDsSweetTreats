/** CONTACT_MAP_REND is empty in static HTML; remote JS injects the map. */
const MAP_QUERY = "Fairfax, VA, USA";
const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed&z=12`;
const MAP_DIRECTIONS_HREF = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAP_QUERY)}`;

/** Match the empty map shell (absolute fill); ensure min-height so the column isn’t collapsed without JS. */
const MAP_PLACEHOLDER =
  /<div style="(left:0;top:0;right:0;bottom:0;position:absolute[^"]*)" data-aid="CONTACT_MAP_REND"><\/div>/;

/** GoDaddy “Get directions” is a `<button>` wired to remote JS; replace with a real Maps link. */
function replaceGetDirectionsButton(html: string): string {
  const needle = 'data-tccl="ux2.contact.get_directions.click,click"';
  const pos = html.indexOf(needle);
  if (pos === -1) return html;
  const open = html.lastIndexOf("<button", pos);
  if (open === -1) return html;
  let i = open + "<button".length;
  let inQuote: '"' | "'" | null = null;
  while (i < html.length) {
    const ch = html[i];
    if (inQuote) {
      if (ch === inQuote) inQuote = null;
    } else if (ch === '"' || ch === "'") {
      inQuote = ch as '"' | "'";
    } else if (ch === ">") {
      break;
    }
    i++;
  }
  if (i >= html.length) return html;
  const openEnd = i + 1;
  const close = html.indexOf("</button>", openEnd);
  if (close === -1) return html;
  const oldOpen = html.slice(open, openEnd);
  if (!oldOpen.startsWith("<button")) return html;
  const newOpen =
    `<a href="${MAP_DIRECTIONS_HREF}" target="_blank" rel="noopener noreferrer" role="button"` +
    oldOpen.slice("<button".length);
  return (
    html.slice(0, open) +
    newOpen +
    html.slice(openEnd, close) +
    "</a>" +
    html.slice(close + "</button>".length)
  );
}

export function fixContactMap(html: string): string {
  const iframe = `<iframe title="Map: ${MAP_QUERY.replace(/"/g, "&quot;")}" src="${MAP_EMBED_SRC}" style="border:0;width:100%;height:100%;position:absolute;left:0;top:0;min-height:100%" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
  let out = html.replace(
    MAP_PLACEHOLDER,
    `<div style="$1;min-height:420px;width:100%;height:100%" data-aid="CONTACT_MAP_REND">${iframe}</div>`,
  );
  out = replaceGetDirectionsButton(out);
  return out;
}
