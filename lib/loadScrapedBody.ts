import fs from "fs";
import path from "path";

import { fixContactMap } from "./fixContactMap";
import { fixGoDaddyLazyImages } from "./fixGoDaddyLazyImages";
import { fixHeaderNavVisibility } from "./fixHeaderNavVisibility";
import { fixOurStoryGallery } from "./fixOurStoryGallery";
import { fixPoweredByFooter } from "./fixPoweredByFooter";

export function loadScrapedBody(filename: string): string {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "scraped", filename),
    "utf8",
  );
  return fixPoweredByFooter(
    fixOurStoryGallery(
      fixContactMap(fixGoDaddyLazyImages(fixHeaderNavVisibility(raw))),
    ),
  );
}
