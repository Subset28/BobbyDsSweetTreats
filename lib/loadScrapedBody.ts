import fs from "fs";
import path from "path";

import { fixContactMap } from "./fixContactMap";
import { fixFeaturedProducts } from "./fixFeaturedProducts";
import { fixLazyPlaceholderImages } from "./fixLazyPlaceholderImages";
import { fixHeaderNavVisibility } from "./fixHeaderNavVisibility";
import { fixMembershipScrapedPlaceholders } from "./fixMembershipScrapedPlaceholders";
import {
  type PrimaryNavHighlight,
  fixPrimaryNavHighlight,
} from "./fixPrimaryNavHighlight";
import { fixOurStoryGallery } from "./fixOurStoryGallery";
import { fixPoweredByFooter } from "./fixPoweredByFooter";
import { fixRemoveMenuFootnotePlaceholder } from "./fixRemoveMenuFootnotePlaceholder";
import { fixShopStorefront } from "./fixShopStorefront";
import { mergeCanonicalChrome } from "./mergeCanonicalChrome";
import { rewriteMirrorAbsoluteUrls } from "./rewriteMirrorAbsoluteUrls";
import { stripShopHeaderPromo } from "./stripShopHeaderPromo";

const HOME_BODY = "home-body-inner.html";

/**
 * `home-body-inner` header `<div>` balances past the real nav (Hero sits inside that range), so merging
 * other pages with it prepends the **home Hero** onto shop / membership / legal pages. Terms has the same
 * chrome ids without that bleed.
 */
const SLIM_CHROME_BODY = "terms-body-inner.html";

const CONTENT_DIR = path.join(process.cwd(), "content");

function readScraped(filename: string): string {
  return fs.readFileSync(path.join(CONTENT_DIR, filename), "utf8");
}

/** Transforms that may touch header, main, or footer on a single scrape file. */
function processScrapedFile(filename: string, raw: string): string {
  let html = fixHeaderNavVisibility(raw);
  html = fixLazyPlaceholderImages(html);
  html = fixContactMap(html);
  html = fixOurStoryGallery(html);
  if (filename === "shop-body-inner.html") {
    html = fixShopStorefront(html);
  }
  if (filename === HOME_BODY) {
    html = fixFeaturedProducts(html);
  }
  html = fixRemoveMenuFootnotePlaceholder(html);
  html = fixMembershipScrapedPlaceholders(html);
  return html;
}

function navHighlightForFile(filename: string): PrimaryNavHighlight {
  if (filename === "shop-body-inner.html") return "shop";
  if (filename === "cart-body-inner.html") return "shop";
  if (filename === HOME_BODY) return "home";
  return "none";
}

export function loadScrapedBody(filename: string): string {
  const processed = processScrapedFile(filename, readScraped(filename));

  if (filename === HOME_BODY) {
    return rewriteMirrorAbsoluteUrls(fixPoweredByFooter(processed));
  }

  const canonicalProcessed = processScrapedFile(
    SLIM_CHROME_BODY,
    readScraped(SLIM_CHROME_BODY),
  );
  const canonicalFull = fixPoweredByFooter(canonicalProcessed);

  let html = mergeCanonicalChrome(canonicalFull, processed);
  html = fixPrimaryNavHighlight(html, navHighlightForFile(filename));
  if (filename === "shop-body-inner.html") {
    html = stripShopHeaderPromo(html);
  }
  return rewriteMirrorAbsoluteUrls(html);
}
