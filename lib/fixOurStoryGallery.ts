import { OUR_STORY_GALLERY_BASES } from "./ourStoryGalleryImages";
import { resolveSiteMediaLocalPath } from "./resolveSiteMediaUrl";

const BS9 = 'id="bs-9"';

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

export function fixOurStoryGallery(html: string): string {
  if (!html.includes(BS9) || html.includes("bst-gallery-static")) {
    return html;
  }

  const trackRe = /<ul class="carousel-track"[^>]*>[\s\S]*?<\/ul>/;
  if (!trackRe.test(html)) return html;

  const resolved = OUR_STORY_GALLERY_BASES.map((b) =>
    resolveSiteMediaLocalPath(b),
  );

  const slides = resolved
    .map((src, idx) => {
      const selected = idx === 0 ? " carousel-slide-selected" : "";
      const opacity = idx === 0 ? 1 : 0.35;
      const safe = escapeAttr(src);
      return `<li style="margin-left:5px;height:600px;width:32%;min-width:240px;overflow-y:hidden;min-height:600px;overflow-x:hidden;vertical-align:top;opacity:${opacity}" data-index="${idx}" class="carousel-slide${selected}"><img src="${safe}" alt="" width="800" height="1200" style="width:100%;height:100%;object-fit:cover;display:block" loading="lazy" decoding="async"/></li>`;
    })
    .join("");

  const newTrack = `<ul class="carousel-track" style="line-height:0;transform:translateX(0);transition:none">${slides}</ul>`;

  let out = html.replace(trackRe, newTrack);

  const thumbRe =
    /<ul([^>]*data-aid="THUMBNAIL_NAV_LIST"[^>]*)><\/ul>/;
  const thumbs = resolved
    .map((src, idx) => {
      const safe = escapeAttr(src);
      return `<li style="display:inline-block;margin:2px 3px;vertical-align:middle" data-thumb-index="${idx}"><button type="button" style="padding:0;border:2px solid transparent;background:none;cursor:default" aria-label="Gallery image ${idx + 1}"><img src="${safe}" alt="" width="72" height="72" style="width:72px;height:72px;object-fit:cover;display:block" loading="lazy"/></button></li>`;
    })
    .join("");
  out = out.replace(thumbRe, `<ul$1>${thumbs}</ul>`);

  out = out.replace(
    '<div class="carousel-viewport" style="width:100%;height:600px">',
    '<div class="carousel-viewport" style="width:100%;height:600px;overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch">',
  );

  out = out.replace(
    '<div class="carousel" style="width:100%;height:auto">',
    '<div class="carousel loaded bst-gallery-static" style="width:100%;height:auto">',
  );

  return out;
}
