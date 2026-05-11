import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/auth/LoginForm";
import { MembershipShell } from "@/components/auth/MembershipShell";

export const metadata: Metadata = {
  title: "Login | BobbieD's Sweet Treats",
  description:
    "Sign in to your account to access your profile, history, and any private pages.",
};

/** Mirrors the live `/m/login` markup (legacy storefront route). */
export default function MembershipAccountPage() {
  return (
    <MembershipShell
      eyebrow="ACCOUNT"
      title="SIGN IN"
      description="Sign in to your account to access your profile, history, and any private pages."
      footer={
        <p className="membership-page__meta">
          <Link href="/m/reset-password">Forgot password?</Link>
        </p>
      }
    >
      <LoginForm variant="membership" />
    </MembershipShell>
  );
}
