import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login | BobbieD's Sweet Treats",
  description: "Sign in to manage your BobbieD's Sweet Treats account.",
};

export default function LoginPage() {
  return (
    <AuthShell
      badge="Customer sign in"
      title="Welcome back"
      description="Use your account to move faster through checkout, save favorites, and keep your order history in one place."
      points={[
        "Fast access to your saved details",
        "A smoother checkout experience",
        "Account-ready for future loyalty features",
      ]}
      footerPrompt="New here?"
      footerLinkHref="/signup"
      footerLinkLabel="Create an account"
    >
      <LoginForm />
    </AuthShell>
  );
}
