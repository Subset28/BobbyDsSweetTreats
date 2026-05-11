import type { Metadata } from "next";

import { MembershipShell } from "@/components/auth/MembershipShell";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create account | BobbieD's Sweet Treats",
  description: "Create your BobbieD's Sweet Treats account.",
};

export default function MembershipCreateAccountPage() {
  return (
    <MembershipShell
      eyebrow="ACCOUNT"
      title="CREATE ACCOUNT"
      description="Create an account to track orders and access member-only pages."
    >
      <SignupForm variant="membership" />
    </MembershipShell>
  );
}
