import type { Metadata } from "next";
import { ScrapedHtml } from "@/components/ScrapedHtml";
import { RequireAuth } from "@/components/RequireAuth";
import { loadScrapedBody } from "@/lib/loadScrapedBody";

export const metadata: Metadata = {
  title: "Orders | BobbieD's Sweet Treats",
  description: "View your BobbieD's Sweet Treats order history.",
};

export default function MembershipOrdersPage() {
  const html = loadScrapedBody("m-orders-body-inner.html");
  return (
    <>
      <RequireAuth />
      <ScrapedHtml
        html={html}
        className="scraped-membership-page scraped-membership-orders"
      />
    </>
  );
}
