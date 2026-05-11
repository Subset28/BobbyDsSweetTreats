import type { Metadata } from "next";

import { MembershipShell } from "@/components/auth/MembershipShell";
import { OrdersList } from "@/components/orders/OrdersList";
import { RequireAuth } from "@/components/RequireAuth";

export const metadata: Metadata = {
  title: "My orders | BobbieD's Sweet Treats",
  description: "View your BobbieD's Sweet Treats order history.",
};

export default function MembershipOrdersPage() {
  return (
    <>
      <RequireAuth />
      <MembershipShell
        eyebrow="ACCOUNT"
        title="MY ORDERS"
        description="Your recent orders are listed below."
      >
        <OrdersList />
      </MembershipShell>
    </>
  );
}
