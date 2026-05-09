import { PRODUCT_CATALOG } from "./productCatalog";

export type ShopProduct = {
  title: string;
  price: string;
  /** Path under `public/` (`/site-media/...`) or full image URL */
  imageSrc: string;
};

/**
 * Slug order matches the legacy storefront “Most popular” ordering.
 * Listing prices are the single storefront amounts shown on each product card.
 */
const SHOP_ORDER = [
  "a-dozen-chocolate-covered-strawberries",
  "valentines-day-treat-box",
  "vanilla-cake-pops",
  "chocolate-covered-pretzels",
  "chocolate-strawberry-bouquet",
  "confetti-cake-pops",
  "heart-shaped-brownies",
  "chocolate-crunch-cake-pop",
  "strawberry-shortcake-pops",
  "nutella-cake-pops",
  "chocolate-covered-strawberries-gift-box",
  "chocolate-covered-oreos",
  "valentines-day-chocolate-bark",
  "special-valentines-day-set",
  "chocolate-covered-peanut-butter-balls",
] as const;

/** Price text shown on shop cards. */
const STOREFRONT_LIST_PRICE: Record<(typeof SHOP_ORDER)[number], string> = {
  "a-dozen-chocolate-covered-strawberries": "$35",
  "valentines-day-treat-box": "$30",
  "vanilla-cake-pops": "$3",
  "chocolate-covered-pretzels": "$24",
  "chocolate-strawberry-bouquet": "$50",
  "confetti-cake-pops": "$3",
  "heart-shaped-brownies": "$21",
  "chocolate-crunch-cake-pop": "$3",
  "strawberry-shortcake-pops": "$3",
  "nutella-cake-pops": "$3",
  "chocolate-covered-strawberries-gift-box": "$40",
  "chocolate-covered-oreos": "$30",
  "valentines-day-chocolate-bark": "$20",
  "special-valentines-day-set": "$50",
  "chocolate-covered-peanut-butter-balls": "$12",
};

/** Prefer mirrored `/site-media/` assets when present; else catalog CDN URL. */
const LOCAL_CARD_IMAGE: Partial<Record<(typeof SHOP_ORDER)[number], string>> = {
  "a-dozen-chocolate-covered-strawberries": "/site-media/83a31b2892fe9273.jpg",
  "vanilla-cake-pops": "/site-media/56f5e476231a2b2e.jpg",
  "chocolate-covered-pretzels": "/site-media/55ee6d7ab193415e.jpg",
  "chocolate-strawberry-bouquet": "/site-media/133aeae4fe6164ab.jpg",
  "confetti-cake-pops": "/site-media/41a53fb16b135233.jpg",
  "heart-shaped-brownies": "/site-media/a2967d0fcc940f11.png",
  "chocolate-crunch-cake-pop": "/site-media/555fbb29ae696c03.jpg",
  "strawberry-shortcake-pops": "/site-media/d88d572addf990ae.jpg",
  "nutella-cake-pops": "/site-media/f7ab6e9a73954c32.jpg",
  "chocolate-covered-oreos": "/site-media/790fbdc4458c897b.jpg",
  "valentines-day-chocolate-bark": "/site-media/08bf37d3056a3729.jpg",
  "chocolate-covered-peanut-butter-balls": "/site-media/5cba9cfb0d2c6658.jpg",
};

function catalogBySlug(slug: (typeof SHOP_ORDER)[number]) {
  const item = PRODUCT_CATALOG.find((p) => p.slug === slug);
  if (!item) throw new Error(`Missing catalog entry for slug: ${slug}`);
  return item;
}

export const SHOP_PRODUCTS: ShopProduct[] = SHOP_ORDER.map((slug) => {
  const p = catalogBySlug(slug);
  return {
    title: p.title,
    price: STOREFRONT_LIST_PRICE[slug],
    imageSrc: LOCAL_CARD_IMAGE[slug] ?? p.image,
  };
});
