import type { Metadata } from "next";
import { ScrapedHtml } from "@/components/ScrapedHtml";
import { loadScrapedBody } from "@/lib/loadScrapedBody";

export const metadata: Metadata = {
  title: "Orders | BobbieD's Sweet Treats",
  description: "View your BobbieD's Sweet Treats order history.",
};

export default function MembershipOrdersPage() {
  /** Live `/m/orders` 302s to `/m/login` when logged out; scrape matches that gate. */
  const html = loadScrapedBody("m-orders-body-inner.html");
  return (
    <ScrapedHtml
      html={html}
      className="scraped-membership-page scraped-membership-orders"
    />
  );
}
