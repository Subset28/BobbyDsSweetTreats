import type { Metadata } from "next";

import { CartView } from "@/components/cart/CartView";
import { SiteShell } from "@/components/site/SiteShell";

export const metadata: Metadata = {
  title: "Cart | BobbieD's Sweet Treats",
  description: "Review and check out the treats in your cart.",
};

export default function CartPage() {
  return (
    <SiteShell>
      <section className="bst-cart-page">
        <CartView />
      </section>
    </SiteShell>
  );
}
