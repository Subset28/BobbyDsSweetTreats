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
import { relaxScrapedPageShellStretch } from "./relaxScrapedPageShellStretch";
import { rewriteMirrorAbsoluteUrls } from "./rewriteMirrorAbsoluteUrls";
import { stripShopHeaderPromo } from "./stripShopHeaderPromo";

const HOME_BODY = "home-body-inner.html";

/** Merged membership shells: strip GoDaddy Page utilities that force auto margins / min-height coupling. */
const RELAX_PAGE_SHELL_FILES = new Set([
  "m-login-body-inner.html",
  "m-create-account-body-inner.html",
]);

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

  /** Same header + footer shell as Home so utilities/icons match; strip hero/promo below. */
  const canonicalProcessed = processScrapedFile(
    HOME_BODY,
    readScraped(HOME_BODY),
  );
  const canonicalFull = fixPoweredByFooter(canonicalProcessed);

  let html = mergeCanonicalChrome(canonicalFull, processed);
  html = fixPrimaryNavHighlight(html, navHighlightForFile(filename));
  html = stripShopHeaderPromo(html);
  if (RELAX_PAGE_SHELL_FILES.has(filename)) {
    html = relaxScrapedPageShellStretch(html);
  }
  return rewriteMirrorAbsoluteUrls(html);
}
