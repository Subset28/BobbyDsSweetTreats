/** Flat catalog for /shop — one card per menu item from the scraped home menu (14 items). */
export type ShopProduct = {
  title: string;
  price: string;
  /** Path under `public/` → `/site-media/...` */
  imageSrc: string;
};

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    title: "Strawberries",
    price: "$3 / $17.50 / $35",
    imageSrc: "/site-media/83a31b2892fe9273.jpg",
  },
  {
    title: "Chocolate hazelnut Order One/Six/Dozen",
    price: "$3 / $16.50 / $33",
    imageSrc: "/site-media/f7ab6e9a73954c32.jpg",
  },
  {
    title: "Chocolate Crunch Order One/Six/Dozen",
    price: "$3 / $16.50 / $33",
    imageSrc: "/site-media/555fbb29ae696c03.jpg",
  },
  {
    title: "Strawberry Crunch Order One/Six/Dozen",
    price: "$3 / $16.50 / $33",
    imageSrc: "/site-media/d88d572addf990ae.jpg",
  },
  {
    title: "Confetti Cake Order One/Six/Dozen",
    price: "$3 / $16.50 / $33",
    imageSrc: "/site-media/41a53fb16b135233.jpg",
  },
  {
    title: "Vanilla Order One/Six/Dozen",
    price: "$3 / $16.50 / $33",
    imageSrc: "/site-media/56f5e476231a2b2e.jpg",
  },
  {
    title: "Chocolate Dipped Brownies Order One/Six/Dozen",
    price: "$4 / $21 / $42",
    imageSrc: "/site-media/a2967d0fcc940f11.png",
  },
  {
    title: "Chocolate Dipped Cookies Order One/Six/Dozen",
    price: "$3 / $16.50 / $30",
    imageSrc: "/site-media/790fbdc4458c897b.jpg",
  },
  {
    title: "Chocolate Dipped Pretzels Order One/Six/Dozen",
    price: "$2 / $12 / $24",
    imageSrc: "/site-media/55ee6d7ab193415e.jpg",
  },
  {
    title:
      "Chocolate Bark a choice of white or milk chocolate with various toppings.",
    price: "$25",
    imageSrc: "/site-media/08bf37d3056a3729.jpg",
  },
  {
    title: "A dozen chocolate covered peanut butter balls.",
    price: "$12",
    imageSrc: "/site-media/5cba9cfb0d2c6658.jpg",
  },
  {
    title: "Cake pops",
    price: "$4 / $24 / $48",
    imageSrc: "/site-media/3d69d0a1faa5d5a0.jpg",
  },
  {
    title: "Brownies",
    price: "$4 / $21 / $42",
    imageSrc: "/site-media/aaae3c2c61134042.png",
  },
  {
    title: "Chocolate covered strawberry Bouquet 12/18",
    price: "$45 / $60",
    imageSrc: "/site-media/133aeae4fe6164ab.jpg",
  },
];
