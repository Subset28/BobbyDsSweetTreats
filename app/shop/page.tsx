import type { Metadata } from "next";

import { ShopPage } from "@/components/shop/ShopPage";
import { SiteShell } from "@/components/site/SiteShell";

export const metadata: Metadata = {
  title: "Shop | BobbieD's Sweet Treats",
  description:
    "Browse BobbieD's Sweet Treats: handmade chocolate covered strawberries, cake pops, brownies, pretzels, and more.",
};

export default function Shop() {
  return (
    <SiteShell>
      <section className="bst-shop-page">
        <ShopPage />
      </section>
    </SiteShell>
  );
}
