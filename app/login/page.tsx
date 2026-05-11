import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in | BobbieD's Sweet Treats",
  description: "Sign in to manage your BobbieD's Sweet Treats account.",
};

export default function LoginPage() {
  return (
    <AuthShell
      badge="Welcome back"
      title="Sign in to your account"
      description="Track orders, save favorite treats, and breeze through checkout."
      points={[
        "Track orders and view your purchase history",
        "Save favorites to find them again later",
        "Speed through checkout with saved details",
      ]}
      footerPrompt="Need an account?"
      footerLinkHref="/signup"
      footerLinkLabel="Create one"
    >
      <LoginForm />
    </AuthShell>
  );
}
