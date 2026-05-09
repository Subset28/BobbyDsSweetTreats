import type { Metadata } from "next";
import Link from "next/link";
import { MembershipShell } from "@/components/auth/MembershipShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset password | BobbieD's Sweet Treats",
  description: "Reset your BobbieD's Sweet Treats account password.",
};

export default function MembershipResetPasswordPage() {
  return (
    <MembershipShell
      eyebrow="ACCOUNT"
      title="RESET PASSWORD"
      description="Enter the email address for your account and we will send you a reset link."
      footer={
        <p className="membership-page__meta">
          <Link href="/m/account">Back to sign in</Link>
        </p>
      }
    >
      <ResetPasswordForm />
    </MembershipShell>
  );
}
