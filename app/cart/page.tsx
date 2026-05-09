import { CartStorefrontMount } from "@/components/CartStorefrontMount";
import { ScrapedHtml } from "@/components/ScrapedHtml";
import { loadScrapedBody } from "@/lib/loadScrapedBody";

export default function CartPage() {
  const html = loadScrapedBody("cart-body-inner.html");
  return (
    <>
      <ScrapedHtml html={html} className="scraped-shop-page" />
      <CartStorefrontMount />
    </>
  );
}
