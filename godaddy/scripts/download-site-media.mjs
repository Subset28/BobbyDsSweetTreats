/**
 * Download every img1.wsimg.com asset referenced in scraped HTML, godaddy-all.css,
 * and app/layout.tsx; save under public/site-media/ and rewrite sources to /site-media/...
 *
 * Run: node scripts/download-site-media.mjs
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public", "site-media");
const filesToScan = [
  path.join(root, "scraped", "home-body-inner.html"),
  path.join(root, "scraped", "shop-body-inner.html"),
  path.join(root, "scraped", "privacy-body-inner.html"),
  path.join(root, "scraped", "terms-body-inner.html"),
  path.join(root, "app", "godaddy-all.css"),
  path.join(root, "app", "layout.tsx"),
];

function normalizeUrl(raw) {
  let u = raw.replace(/&amp;/g, "&").trim();
  if (u.startsWith("//")) u = `https:${u}`;
  return u;
}

function hashUrl(u) {
  return crypto.createHash("sha256").update(u).digest("hex").slice(0, 16);
}

function extFromMime(ct) {
  if (!ct) return ".bin";
  if (ct.includes("jpeg")) return ".jpg";
  if (ct.includes("png")) return ".png";
  if (ct.includes("gif")) return ".gif";
  if (ct.includes("webp")) return ".webp";
  if (ct.includes("svg")) return ".svg";
  if (ct.includes("font/woff2")) return ".woff2";
  if (ct.includes("octet-stream") && ct.includes("woff")) return ".woff2";
  return ".bin";
}

function extFromPath(u) {
  const m = u.match(/\.(jpg|jpeg|png|gif|webp|svg|woff2)(?:\?|$|\/)/i);
  if (m) return `.${m[1].toLowerCase() === "jpeg" ? "jpg" : m[1].toLowerCase()}`;
  return null;
}

/**
 * CSS url() — path ends at closing paren.
 */
function collectUrlsFromCssUrl(text) {
  const set = new Set();
  const urlFn = /url\(\s*(https:\/\/img1\.wsimg\.com[^)]+)\s*\)/gi;
  let m;
  while ((m = urlFn.exec(text))) {
    set.add(normalizeUrl(m[1]));
  }
  return set;
}

/**
 * HTML / srcset: allow commas inside paths; allow `)` in filenames like `_(2).jpg`.
 * Stop at `)` only after font extensions (closing CSS url() handled above).
 */
function collectUrlsFromHtml(text) {
  const set = new Set();
  const re = /(?:https:)?\/\/img1\.wsimg\.com/gi;
  let m;
  while ((m = re.exec(text))) {
    let i = m.index + m[0].length;
    while (i < text.length) {
      const c = text[i];
      if (
        c === '"' ||
        c === "'" ||
        c === "<" ||
        c === "\n" ||
        c === "\r"
      ) {
        break;
      }
      if (c === ")") {
        const soFar = text.slice(m.index, i);
        if (/\.(woff2|woff|ttf|otf)$/i.test(soFar)) break;
      }
      if (c === " ") {
        const rest = text.slice(i + 1);
        if (/^\d+w\b/.test(rest) || /^[\d.]+x\b/.test(rest)) break;
      }
      if (c === ",") {
        const trimmed = text.slice(i + 1).trimStart();
        if (
          trimmed.startsWith("//img1.wsimg.com") ||
          trimmed.startsWith("https://img1.wsimg.com")
        ) {
          break;
        }
      }
      i++;
    }
    const u = normalizeUrl(text.slice(m.index, i));
    if (u.startsWith("https://img1.wsimg.com")) set.add(u);
  }
  return set;
}

function collectUrls(text) {
  return [
    ...new Set([...collectUrlsFromCssUrl(text), ...collectUrlsFromHtml(text)]),
  ];
}

function replaceVariants(canonical) {
  const pathOnly = canonical.replace(/^https:\/\/img1\.wsimg\.com/i, "");
  const slashForm = `//img1.wsimg.com${pathOnly}`;
  const ampCanonical = canonical.replace(/&/g, "&amp;");
  const ampSlash = slashForm.replace(/&/g, "&amp;");
  return [...new Set([canonical, slashForm, ampCanonical, ampSlash])];
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  for (const f of fs.readdirSync(outDir)) {
    fs.unlinkSync(path.join(outDir, f));
  }

  let combined = "";
  for (const fp of filesToScan) {
    if (fs.existsSync(fp)) combined += fs.readFileSync(fp, "utf8") + "\n";
  }

  const urls = collectUrls(combined);
  console.log(`Found ${urls.length} unique img1.wsimg.com URLs`);

  /** @type {Map<string, string>} canonical -> /site-media/file.ext */
  const urlToLocal = new Map();

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    process.stdout.write(`\r[${i + 1}/${urls.length}] ${url.slice(0, 72)}…`);
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; BobbieSiteExport/1.0; +https://bobbiedsweettreats.com)",
          Accept: "*/*",
        },
      });
      if (!res.ok) {
        console.warn(`\nSKIP ${res.status} ${url.slice(0, 80)}`);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      const mime = res.headers.get("content-type") || "";
      let ext = extFromPath(url) || extFromMime(mime);
      if (ext === ".bin" && mime.includes("image")) ext = ".jpg";
      const fname = `${hashUrl(url)}${ext}`;
      const diskPath = path.join(outDir, fname);
      fs.writeFileSync(diskPath, buf);
      const webPath = `/site-media/${fname}`;
      urlToLocal.set(url, webPath);
    } catch (e) {
      console.warn(`\nFAIL ${url.slice(0, 80)}`, e.message);
    }
  }
  console.log(`\nDownloaded ${urlToLocal.size} files into public/site-media/`);

  const manifest = Object.fromEntries(urlToLocal);
  fs.writeFileSync(
    path.join(outDir, "manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf8",
  );

  /** Rewrite file contents: longest URLs first */
  const entries = [...urlToLocal.entries()].sort(
    (a, b) => b[0].length - a[0].length,
  );

  /** Do not replace a short URL if it is only a prefix of a longer isteam path (`…jpg/:/rs=…`). */
  function replaceOne(haystack, from, to) {
    if (!from) return haystack;
    let out = "";
    let i = 0;
    while (i < haystack.length) {
      const idx = haystack.indexOf(from, i);
      if (idx === -1) {
        out += haystack.slice(i);
        break;
      }
      const after = haystack.slice(idx + from.length);
      if (after.startsWith("/:/")) {
        out += haystack.slice(i, idx + 1);
        i = idx + 1;
        continue;
      }
      out += haystack.slice(i, idx) + to;
      i = idx + from.length;
    }
    return out;
  }

  function rewriteContent(content) {
    let out = content;
    for (const [canonical, local] of entries) {
      for (const v of replaceVariants(canonical)) {
        out = replaceOne(out, v, local);
      }
    }
    return out;
  }

  for (const fp of filesToScan) {
    if (!fs.existsSync(fp)) continue;
    const before = fs.readFileSync(fp, "utf8");
    const after = rewriteContent(before);
    if (after !== before) {
      fs.writeFileSync(fp, after, "utf8");
      console.log("Rewrote", path.relative(root, fp));
    }
  }

  console.log("Done. Commit public/site-media/ and updated source files.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
