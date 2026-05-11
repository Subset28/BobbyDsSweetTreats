import type { Metadata } from "next";

import { SiteShell } from "@/components/site/SiteShell";

export const metadata: Metadata = {
  title: "Privacy Policy | BobbieD's Sweet Treats",
  description: "BobbieD's Sweet Treats privacy policy.",
};

export default function PrivacyPolicyPage() {
  return (
    <SiteShell>
      <article className="site-legal">
        <h1>Privacy Policy</h1>
        <p>Privacy Policy coming soon</p>
      </article>
    </SiteShell>
  );
}
