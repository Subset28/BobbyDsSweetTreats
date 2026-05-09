/** CONTACT_MAP_REND is empty in static HTML; remote JS injects the map. */
const MAP_QUERY = "Fairfax, VA, USA";
const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed&z=12`;

/** Match the empty map shell (absolute fill); ensure min-height so the column isn’t collapsed without JS. */
const MAP_PLACEHOLDER =
  /<div style="(left:0;top:0;right:0;bottom:0;position:absolute[^"]*)" data-aid="CONTACT_MAP_REND"><\/div>/;

export function fixContactMap(html: string): string {
  const iframe = `<iframe title="Map: ${MAP_QUERY.replace(/"/g, "&quot;")}" src="${MAP_EMBED_SRC}" style="border:0;width:100%;height:100%;position:absolute;left:0;top:0;min-height:420px" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
  return html.replace(
    MAP_PLACEHOLDER,
    `<div style="$1;min-height:420px;width:100%" data-aid="CONTACT_MAP_REND">${iframe}</div>`,
  );
}
