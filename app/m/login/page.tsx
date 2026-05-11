import type { Metadata } from "next";
import { MembershipLoginPageClient } from "@/components/membership/MembershipLoginPageClient";
import { loadScrapedBody } from "@/lib/loadScrapedBody";

export const metadata: Metadata = {
  title: "Login | BobbieD's Sweet Treats",
  description:
    "Sign in to your account to access your profile, history, and any private pages.",
};

/** Same markup as live `/m/login` (mirrors legacy storefront route). */
export default function MembershipLoginAliasPage() {
  const html = loadScrapedBody("m-login-body-inner.html");
  return <MembershipLoginPageClient loginHtml={html} />;
}
