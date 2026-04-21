import { ScrapedHtml } from "@/components/ScrapedHtml";
import { loadScrapedBody } from "@/lib/loadScrapedBody";

export default function PrivacyPolicyPage() {
  const html = loadScrapedBody("privacy-body-inner.html");
  return <ScrapedHtml html={html} />;
}
