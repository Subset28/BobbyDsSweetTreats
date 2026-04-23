import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up | BobbieD's Sweet Treats",
  description: "Create a BobbieD's Sweet Treats account.",
};

export default function SignupPage() {
  return (
    <AuthShell
      badge="Create account"
      title="Start your sweet account"
      description="Create a profile to save your details, make future orders quicker, and keep everything organized from one place."
      points={[
        "Save time on repeat orders",
        "Keep your favorite treats close by",
        "Be ready for future account features",
      ]}
      footerPrompt="Already have an account?"
      footerLinkHref="/login"
      footerLinkLabel="Sign in"
    >
      <SignupForm />
    </AuthShell>
  );
}
