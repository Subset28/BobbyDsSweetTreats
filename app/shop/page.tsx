import { ScrapedHtml } from "@/components/ScrapedHtml";
import { loadScrapedBody } from "@/lib/loadScrapedBody";

export default function ShopPage() {
  const html = loadScrapedBody("shop-body-inner.html");
  return <ScrapedHtml html={html} />;
}
