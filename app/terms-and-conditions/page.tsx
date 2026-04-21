import { ScrapedHtml } from "@/components/ScrapedHtml";
import { loadScrapedBody } from "@/lib/loadScrapedBody";

export default function TermsPage() {
  const html = loadScrapedBody("terms-body-inner.html");
  return <ScrapedHtml html={html} />;
}
