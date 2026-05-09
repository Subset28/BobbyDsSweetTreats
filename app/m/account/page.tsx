import type { Metadata } from "next";
import { ScrapedHtml } from "@/components/ScrapedHtml";
import { loadScrapedBody } from "@/lib/loadScrapedBody";

export const metadata: Metadata = {
  title: "Login | BobbieD's Sweet Treats",
  description:
    "Sign in to your account to access your profile, history, and any private pages.",
};

export default function MembershipAccountPage() {
  const html = loadScrapedBody("m-login-body-inner.html");
  return (
    <ScrapedHtml
      html={html}
      className="scraped-membership-page scraped-membership-login"
      membershipForms="login"
    />
  );
}
