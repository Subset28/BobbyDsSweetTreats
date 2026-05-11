import type { Metadata } from "next";
import { MembershipLoginPageClient } from "@/components/membership/MembershipLoginPageClient";
import { loadScrapedBody } from "@/lib/loadScrapedBody";

export const metadata: Metadata = {
  title: "Login | BobbieD's Sweet Treats",
  description: "Sign in to manage your BobbieD's Sweet Treats account.",
};

/** Alias for scraped `/m/login` markup (bookmark-friendly). */
export default function LoginPage() {
  const html = loadScrapedBody("m-login-body-inner.html");
  return <MembershipLoginPageClient loginHtml={html} />;
}
