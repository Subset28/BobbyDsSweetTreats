import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create account | BobbieD's Sweet Treats",
  description: "Create a BobbieD's Sweet Treats account.",
};

export default function SignupPage() {
  return (
    <AuthShell
      badge="Get started"
      title="Create your account"
      description="Join BobbieD's Sweet Treats to track orders, save favorites, and speed through checkout."
      points={[
        "Track orders and view your purchase history",
        "Save favorites to find them again later",
        "Speed through checkout with saved details",
      ]}
      footerPrompt="Already have an account?"
      footerLinkHref="/login"
      footerLinkLabel="Sign in"
    >
      <SignupForm />
    </AuthShell>
  );
}
