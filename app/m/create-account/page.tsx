import type { Metadata } from "next";
import { ScrapedHtml } from "@/components/ScrapedHtml";
import { loadScrapedBody } from "@/lib/loadScrapedBody";

export const metadata: Metadata = {
  title: "Create account | BobbieD's Sweet Treats",
  description: "Create your BobbieD's Sweet Treats account.",
};

export default function MembershipCreateAccountPage() {
  const html = loadScrapedBody("m-create-account-body-inner.html");
  return (
    <ScrapedHtml
      html={html}
      className="scraped-membership-page scraped-membership-signup"
      membershipForms="signup"
    />
  );
}
