import type { Metadata } from "next";
import { MembershipLoginPageClient } from "@/components/membership/MembershipLoginPageClient";
import { loadScrapedBody } from "@/lib/loadScrapedBody";

export const metadata: Metadata = {
  title: "Account | BobbieD's Sweet Treats",
  description:
    "Sign in to your account to access your profile, history, and any private pages.",
};

export default function MembershipAccountPage() {
  const html = loadScrapedBody("m-login-body-inner.html");
  return <MembershipLoginPageClient loginHtml={html} />;
}
