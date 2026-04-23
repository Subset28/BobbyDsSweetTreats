import { getProductPathByText } from "./productCatalog";

const FEATURED_LOADER =
  /<div data-ux="Block" data-aid="PRODUCT_GROUP_LIST_RENDERED"[^>]*><div data-ux="Block"[^>]*><div data-ux="Block"[^>]*><\/div><div data-ux="Block"[^>]*><div data-ux="Loader"[\s\S]*?<\/div><\/div><\/div><\/div><\/div>/;

const VIEW_ALL_BTN = `<div data-ux="Block" class="x-el x-el-div c1-1 c1-2 c1-4 c1-19 c1-9d c1-9e c1-9f c1-1f c1-4o c1-b c1-c c1-9g c1-d c1-e c1-f c1-g" style="margin-top:28px"><div style="max-width:100%;text-align:center"><a data-ux-btn="primary" data-ux="ButtonPrimary" color="PRIMARY" decoration="NONE" fill="SOLID" shadow="NONE" shape="SQUARE" data-aid="FEATURED_VIEW_ALL_BTN" href="/shop" data-typography="ButtonAlpha" class="x-el x-el-a c1-5o c1-5p c1-9h c1-2s c1-1w c1-9i c1-9j c1-1b c1-1f c1-1g c1-1s c1-1u c1-1t c1-s c1-z c1-5l c1-72 c1-28 c1-29 c1-9k c1-45 c1-9l c1-9m c1-b c1-57 c1-6y c1-5r c1-9n c1-9o c1-9p c1-5x c1-5y c1-5z c1-60">View all products</a></div></div>`;

type Card = { title: string; price: string; src: string };

const CARDS: Card[] = [
  {
    title: "Strawberries",
    price: "$3 / $17.50 / $35",
    src: "/site-media/83a31b2892fe9273.jpg",
  },
  {
    title: "Chocolate Crunch Cake Pop",
    price: "$3 / $16.50 / $33",
    src: "/site-media/d53c813db8fb2eeb.jpg",
  },
  {
    title: "Chocolate Covered Oreos",
    price: "From $3",
    src: "/site-media/0a652586ca168292.jpg",
  },
  {
    title: "Strawberry Shortcake",
    price: "See menu",
    src: "/site-media/6a5496871fefec40.jpg",
  },
];

function cardHtml(c: Card): string {
  const href = getProductPathByText(c.title) ?? "/shop";
  return `<div class="bst-featured-card x-el x-el-div c1-1 c1-2 c1-b c1-c c1-d c1-e c1-f c1-g"><a href="${href}" class="x-el x-el-a c1-1q" style="text-decoration:none;color:inherit"><div class="bst-featured-card-imgwrap"><img src="${c.src}" alt="" width="400" height="320" loading="lazy" decoding="async" class="x-el x-el-img c1-1 c1-2 c1-4 c1-z" style="width:100%;height:220px;object-fit:cover;display:block;border-radius:4px"/></div><h3 class="x-el x-el-h3 c1-1 c1-2 c1-1t c1-5p" style="margin:12px 0 4px;font-size:1.05rem">${c.title}</h3><p class="x-el x-el-p c1-1 c1-2 c1-4p" style="margin:0;color:rgb(87,87,87)">${c.price}</p></a></div>`;
}

function featuredInnerHtml(): string {
  const grid = CARDS.map(cardHtml).join("");
  return `<div data-ux="Block" data-aid="PRODUCT_GROUP_LIST_RENDERED" class="x-el x-el-div c1-1 c1-2 c1-b c1-c c1-d c1-e c1-f c1-g"><div class="bst-featured-grid">${grid}</div>${VIEW_ALL_BTN}</div>`;
}

export function fixFeaturedProducts(html: string): string {
  if (!html.includes("data-aid=\"PRODUCT_GROUP_LIST_RENDERED\"")) return html;
  if (!FEATURED_LOADER.test(html)) return html;
  return html.replace(FEATURED_LOADER, featuredInnerHtml());
}
