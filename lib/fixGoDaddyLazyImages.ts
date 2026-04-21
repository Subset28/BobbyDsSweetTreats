/**
 * GoDaddy WSB serves product images with src=1×1 gif; real URLs are in
 * data-srclazy / data-srcsetlazy and swapped in by their JS (not loaded here).
 */
function httpsifySrcset(srcset: string): string {
  return srcset
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const sp = part.search(/\s/);
      if (sp === -1) {
        const u = part.startsWith("//") ? `https:${part}` : part;
        return u;
      }
      const url = part.slice(0, sp);
      const desc = part.slice(sp);
      const u = url.startsWith("//") ? `https:${url}` : url;
      return u + desc;
    })
    .join(", ");
}

export function fixGoDaddyLazyImages(html: string): string {
  return html.replace(/<img\b([^>]*)>/gi, (full, attrs: string) => {
    if (!/data-srclazy=/i.test(attrs)) return full;

    const srclazy = attrs.match(/data-srclazy="([^"]*)"/i)?.[1];
    if (!srclazy) return full;

    const srcsetlazy = attrs.match(/data-srcsetlazy="([^"]*)"/i)?.[1];

    let a = attrs
      .replace(/\sdata-lazyimg="[^"]*"/gi, "")
      .replace(/\sdata-srclazy="[^"]*"/gi, "")
      .replace(/\sdata-srcsetlazy="[^"]*"/gi, "");

    const src = srclazy.startsWith("//") ? `https:${srclazy}` : srclazy;
    if (/src="/i.test(a)) {
      a = a.replace(/src="[^"]*"/i, `src="${src}"`);
    } else {
      a = ` src="${src}"` + a;
    }

    if (srcsetlazy) {
      const ss = httpsifySrcset(srcsetlazy);
      if (/srcSet="/i.test(a)) {
        a = a.replace(/srcSet="[^"]*"/i, `srcSet="${ss}"`);
      } else if (/srcset="/i.test(a)) {
        a = a.replace(/srcset="[^"]*"/i, `srcSet="${ss}"`);
      } else {
        a += ` srcSet="${ss}"`;
      }
    } else {
      // GoDaddy leaves srcSet pointing at a transparent placeholder while the real
      // file is only in data-srclazy; browsers prefer srcset over src, so strip it.
      a = a.replace(/\s+srcSet="[^"]*"/gi, "");
      a = a.replace(/\s+srcset="[^"]*"/gi, "");
    }

    return `<img${a}>`;
  });
}
