import type { Metadata } from "next";

import { MembershipOrdersApp } from "@/components/orders/MembershipOrdersApp";

export const metadata: Metadata = {
  title: "Orders | BobbieD's Sweet Treats",
  description: "View your BobbieD's Sweet Treats order history.",
};

export default function MembershipOrdersPage() {
  return <MembershipOrdersApp />;
}
