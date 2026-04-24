import fs from "fs";
import path from "path";

import { fixContactMap } from "./fixContactMap";
import { fixFeaturedProducts } from "./fixFeaturedProducts";
import { fixGoDaddyLazyImages } from "./fixGoDaddyLazyImages";
import { fixHeaderNavVisibility } from "./fixHeaderNavVisibility";
import {
  type PrimaryNavHighlight,
  fixPrimaryNavHighlight,
} from "./fixPrimaryNavHighlight";
import { fixOurStoryGallery } from "./fixOurStoryGallery";
import { fixPoweredByFooter } from "./fixPoweredByFooter";
import { fixRemoveMenuFootnotePlaceholder } from "./fixRemoveMenuFootnotePlaceholder";
import { fixShopStorefront } from "./fixShopStorefront";
import { mergeCanonicalChrome } from "./mergeCanonicalChrome";

const HOME_BODY = "home-body-inner.html";

const CONTENT_DIR = path.join(process.cwd(), "content");

function readScraped(filename: string): string {
  return fs.readFileSync(path.join(CONTENT_DIR, filename), "utf8");
}

/** Transforms that may touch header, main, or footer on a single scrape file. */
function processScrapedFile(filename: string, raw: string): string {
  let html = fixHeaderNavVisibility(raw);
  html = fixGoDaddyLazyImages(html);
  html = fixContactMap(html);
  html = fixOurStoryGallery(html);
  if (filename === "shop-body-inner.html") {
    html = fixShopStorefront(html);
  }
  if (filename === HOME_BODY) {
    html = fixFeaturedProducts(html);
  }
  html = fixRemoveMenuFootnotePlaceholder(html);
  return html;
}

function navHighlightForFile(filename: string): PrimaryNavHighlight {
  if (filename === "shop-body-inner.html") return "shop";
  if (filename === HOME_BODY) return "home";
  return "none";
}

export function loadScrapedBody(filename: string): string {
  const processed = processScrapedFile(filename, readScraped(filename));

  if (filename === HOME_BODY) {
    return fixPoweredByFooter(processed);
  }

  const canonicalProcessed = processScrapedFile(HOME_BODY, readScraped(HOME_BODY));
  const canonicalFull = fixPoweredByFooter(canonicalProcessed);

  let html = mergeCanonicalChrome(canonicalFull, processed);
  html = fixPrimaryNavHighlight(html, navHighlightForFile(filename));
  return html;
}
