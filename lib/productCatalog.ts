export type ProductVariant = {
  id: string;
  label: string;
  price: number;
  description?: string;
};

export type ProductCatalogItem = {
  slug: string;
  title: string;
  description: string;
  price: number;
  image: string;
  alt: string;
  cardPrice?: string;
  variants: ProductVariant[];
  aliases: string[];
};

export const PRODUCT_CATALOG: ProductCatalogItem[] = [
  {
    slug: "a-dozen-chocolate-covered-strawberries",
    title: "A Dozen Chocolate Covered Strawberries",
    description: "Delicious strawberries dipped in rich chocolate.",
    price: 35,
    image:
      "https://img1.wsimg.com/isteam/ip/60198da3-e16c-45af-9193-df0c03c69433/Strawberry%203-0ddcf1c.jpg",
    alt: "A dozen chocolate covered strawberries",
    cardPrice: "$35",
    variants: [{ id: "dozen", label: "Dozen", price: 35 }],
    aliases: ["strawberries", "chocolate covered strawberries", "dozen strawberries"],
  },
  {
    slug: "valentines-day-treat-box",
    title: "Valentine's Day Treat Box",
    description:
      "A delightful assortment of chocolate-covered strawberries, pretzels, and marshmallow hearts, perfect for Valentine's Day.",
    price: 30,
    image:
      "https://img1.wsimg.com/isteam/ip/60198da3-e16c-45af-9193-df0c03c69433/Screenshot_20260205_010219_Messages-32abb21.jpg",
    alt: "Valentine's Day treat box",
    cardPrice: "$30",
    variants: [{ id: "box", label: "Standard Box", price: 30 }],
    aliases: ["valentines day treat box", "treat box", "valentine box"],
  },
  {
    slug: "vanilla-cake-pops",
    title: "Vanilla Cake Pops",
    description: "Delicious vanilla cake pops covered in white chocolate and sprinkles.",
    price: 3,
    image:
      "https://img1.wsimg.com/isteam/ip/60198da3-e16c-45af-9193-df0c03c69433/Vanilla-e33e171.jpg",
    alt: "Vanilla cake pops",
    cardPrice: "$3 / $16.50 / $33",
    variants: [
      { id: "single", label: "1 cake pop", price: 3 },
      { id: "six", label: "6 cake pops", price: 16.5 },
      { id: "dozen", label: "12 cake pops", price: 33 },
    ],
    aliases: ["vanilla cake pops", "vanilla"],
  },
  {
    slug: "chocolate-covered-pretzels",
    title: "Chocolate Covered Pretzels",
    description: "Delicious pretzels covered in chocolate and sprinkles.",
    price: 24,
    image:
      "https://img1.wsimg.com/isteam/ip/60198da3-e16c-45af-9193-df0c03c69433/Pretzel%202-51ae0c4.jpg",
    alt: "Chocolate covered pretzels",
    cardPrice: "$2 / $12 / $24",
    variants: [
      { id: "single", label: "1 pretzel pack", price: 2 },
      { id: "six", label: "6 pretzel pack", price: 12 },
      { id: "dozen", label: "12 pretzel pack", price: 24 },
    ],
    aliases: ["chocolate covered pretzels", "pretzels"],
  },
  {
    slug: "chocolate-strawberry-bouquet",
    title: "Chocolate Strawberry Bouquet",
    description: "A beautiful bouquet of chocolate-covered strawberries, perfect for gifting.",
    price: 50,
    image:
      "https://img1.wsimg.com/isteam/ip/60198da3-e16c-45af-9193-df0c03c69433/IMG_20260205_201535_(6)-2b5f174.jpg",
    alt: "Chocolate strawberry bouquet",
    cardPrice: "$50",
    variants: [
      { id: "12", label: "12 strawberries", price: 50 },
      { id: "18", label: "18 strawberries", price: 60 },
    ],
    aliases: ["chocolate strawberry bouquet", "bouquet"],
  },
  {
    slug: "confetti-cake-pops",
    title: "Confetti Cake Pops",
    description: "Delicious confetti cake pops covered in white chocolate and sprinkles.",
    price: 3,
    image:
      "https://img1.wsimg.com/isteam/ip/60198da3-e16c-45af-9193-df0c03c69433/Confetti-9f1643d.jpg",
    alt: "Confetti cake pops",
    cardPrice: "$3 / $16.50 / $33",
    variants: [
      { id: "single", label: "1 cake pop", price: 3 },
      { id: "six", label: "6 cake pops", price: 16.5 },
      { id: "dozen", label: "12 cake pops", price: 33 },
    ],
    aliases: ["confetti cake pops", "confetti cake", "confetti"],
  },
  {
    slug: "heart-shaped-brownies",
    title: "Heart-Shaped Brownies",
    description: "A delightful assortment of heart-shaped brownies, perfect for gifting or snacking.",
    price: 21,
    image:
      "https://img1.wsimg.com/isteam/ip/60198da3-e16c-45af-9193-df0c03c69433/IMG_20260127_220352-11ae0be.png",
    alt: "Heart-shaped brownies",
    cardPrice: "$4 / $21 / $42",
    variants: [
      { id: "single", label: "1 brownie", price: 4 },
      { id: "six", label: "6 brownies", price: 21 },
      { id: "dozen", label: "12 brownies", price: 42 },
    ],
    aliases: ["heart shaped brownies", "brownies", "heart brownies"],
  },
  {
    slug: "chocolate-crunch-cake-pop",
    title: "Chocolate Crunch Cake Pop",
    description: "A delicious chocolate cake pop with a crunchy coating.",
    price: 3,
    image:
      "https://img1.wsimg.com/isteam/ip/60198da3-e16c-45af-9193-df0c03c69433/Chocolate%20crunch%20cake%20pop-65a7af0.jpg",
    alt: "Chocolate crunch cake pop",
    cardPrice: "$3 / $16.50 / $33",
    variants: [
      { id: "single", label: "1 cake pop", price: 3 },
      { id: "six", label: "6 cake pops", price: 16.5 },
      { id: "dozen", label: "12 cake pops", price: 33 },
    ],
    aliases: ["chocolate crunch cake pop", "chocolate crunch", "crunch cake pop"],
  },
  {
    slug: "strawberry-shortcake-pops",
    title: "Strawberry Shortcake Pops",
    description: "Delicious strawberry shortcake flavored cake pops.",
    price: 3,
    image:
      "https://img1.wsimg.com/isteam/ip/60198da3-e16c-45af-9193-df0c03c69433/Strawberry-Shortcake-1-128c58b.jpg",
    alt: "Strawberry shortcake pops",
    cardPrice: "$3 / $16.50 / $33",
    variants: [
      { id: "single", label: "1 cake pop", price: 3 },
      { id: "six", label: "6 cake pops", price: 16.5 },
      { id: "dozen", label: "12 cake pops", price: 33 },
    ],
    aliases: ["strawberry shortcake pops", "strawberry shortcake"],
  },
  {
    slug: "nutella-cake-pops",
    title: "Nutella Cake Pops",
    description: "Delicious chocolate cake pops topped with nuts.",
    price: 3,
    image:
      "https://img1.wsimg.com/isteam/ip/60198da3-e16c-45af-9193-df0c03c69433/IMG_20260127_220351_(1)-a5612aa.jpg",
    alt: "Nutella cake pops",
    cardPrice: "$3 / $16.50 / $33",
    variants: [
      { id: "single", label: "1 cake pop", price: 3 },
      { id: "six", label: "6 cake pops", price: 16.5 },
      { id: "dozen", label: "12 cake pops", price: 33 },
    ],
    aliases: ["nutella cake pops", "chocolate hazelnut", "hazelnut cake pops"],
  },
  {
    slug: "chocolate-covered-strawberries-gift-box",
    title: "Chocolate Covered Strawberries Gift Box",
    description:
      "A delightful assortment of chocolate-covered strawberries, perfect for gifting. Includes a variety of milk, dark, and white chocolate with decorative toppings.",
    price: 40,
    image:
      "https://img1.wsimg.com/isteam/ip/60198da3-e16c-45af-9193-df0c03c69433/Screenshot_20260205_010206_Messages-cb63eb3.jpg",
    alt: "Chocolate covered strawberries gift box",
    cardPrice: "$40",
    variants: [{ id: "box", label: "Gift box", price: 40 }],
    aliases: ["gift box", "strawberries gift box", "chocolate covered strawberries gift box"],
  },
  {
    slug: "chocolate-covered-oreos",
    title: "Chocolate Covered Oreos",
    description: "Delicious chocolate covered Oreos with a rich, creamy coating.",
    price: 30,
    image:
      "https://img1.wsimg.com/isteam/ip/60198da3-e16c-45af-9193-df0c03c69433/chocolate_covered_oreos_recipe-a8ca351.jpg",
    alt: "Chocolate covered Oreos",
    cardPrice: "$30",
    variants: [{ id: "box", label: "Oreo box", price: 30 }],
    aliases: ["chocolate covered oreos", "oreos"],
  },
  {
    slug: "valentines-day-chocolate-bark",
    title: "Valentine's Day Chocolate Bark",
    description:
      "A variety of our custom made chocolate bark served with a variety of toppings(Both milk and White chocolate).",
    price: 20,
    image:
      "https://img1.wsimg.com/isteam/ip/60198da3-e16c-45af-9193-df0c03c69433/Bark%202-5b08dd3.jpg",
    alt: "Valentine's Day chocolate bark",
    cardPrice: "$20",
    variants: [{ id: "bar", label: "Chocolate bark slab", price: 20 }],
    aliases: ["valentines day chocolate bark", "chocolate bark", "bark"],
  },
  {
    slug: "special-valentines-day-set",
    title: "Special Valentine's Day Set",
    description:
      "A beautifully arranged chocolate box spelling 'I Love You' with assorted chocolate covered strawberries and marshmallows.",
    price: 50,
    image:
      "https://img1.wsimg.com/isteam/ip/60198da3-e16c-45af-9193-df0c03c69433/Content-Creator-Project.png",
    alt: "Special Valentine's Day set",
    cardPrice: "$50",
    variants: [{ id: "set", label: "Gift set", price: 50 }],
    aliases: ["special valentines day set", "valentines day set", "i love you box"],
  },
  {
    slug: "chocolate-covered-peanut-butter-balls",
    title: "Chocolate Covered Peanut Butter Balls",
    description:
      "A dozen of our freshly made chocolate covered peanut butter balls.(This item contains peanuts)",
    price: 12,
    image:
      "https://img1.wsimg.com/isteam/ip/60198da3-e16c-45af-9193-df0c03c69433/IMG_20260207_195502.jpg",
    alt: "Chocolate covered peanut butter balls",
    cardPrice: "$12",
    variants: [{ id: "dozen", label: "Dozen", price: 12 }],
    aliases: ["chocolate covered peanut butter balls", "peanut butter balls"],
  },
];

const SLUG_LOOKUP = new Map(
  PRODUCT_CATALOG.map((product) => [
    product.slug,
    product,
  ]),
);

function normalize(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

const ALIAS_LOOKUP = new Map<string, string>();
for (const product of PRODUCT_CATALOG) {
  for (const alias of [product.slug, product.title, ...product.aliases]) {
    ALIAS_LOOKUP.set(normalize(alias), product.slug);
  }
}

export function getProductBySlug(slug: string): ProductCatalogItem | null {
  return SLUG_LOOKUP.get(slug) ?? null;
}

export function getProductPath(slug: string): string {
  return `/shop/${slug}`;
}

export function getProductSlugByText(text: string): string | null {
  const normalized = normalize(text);
  if (!normalized) return null;

  for (const [alias, slug] of ALIAS_LOOKUP.entries()) {
    if (!alias) continue;
    if (normalized === alias) return slug;
    // Prefer exact or long-prefix matches to avoid accidental short substring collisions
    if (alias.startsWith(normalized) && normalized.length > 2) return slug;
    if (alias.includes(normalized) && normalized.length > 3) return slug;
  }

  const rules: Array<[RegExp, string]> = [
    [/vanilla/, "vanilla-cake-pops"],
    [/confetti/, "confetti-cake-pops"],
    [/chocolate crunch/, "chocolate-crunch-cake-pop"],
    [/strawberry shortcake/, "strawberry-shortcake-pops"],
    [/hazelnut|nutella/, "nutella-cake-pops"],
    [/pretzel/, "chocolate-covered-pretzels"],
    [/brownie/, "heart-shaped-brownies"],
    [/strawberry bouquet/, "chocolate-strawberry-bouquet"],
    [/gift box/, "chocolate-covered-strawberries-gift-box"],
    [/oreo/, "chocolate-covered-oreos"],
    [/chocolate bark|bark/, "valentines-day-chocolate-bark"],
    [/peanut butter/, "chocolate-covered-peanut-butter-balls"],
    [/treat box|valentine/, "valentines-day-treat-box"],
  ];

  for (const [pattern, slug] of rules) {
    if (pattern.test(normalized)) return slug;
  }

  return null;
}

export function getProductPathByText(text: string): string | null {
  const slug = getProductSlugByText(text);
  return slug ? getProductPath(slug) : null;
}

export function getProductPathBySlugOrTitle(input: string): string | null {
  return getProductPathByText(input);
}
