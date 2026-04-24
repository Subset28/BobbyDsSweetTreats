import { SHOP_PRODUCTS } from "./shopProducts";
import { getProductPathByText } from "./productCatalog";

/** Empty OLS mount: breadcrumb + blank block (products load only via GoDaddy JS). */
const EMPTY_OLS =
  /(<div data-ux="Block" id="continue-shopping-breadcrumb"[^>]*><\/div>)<div data-ux="Block" class="x-el x-el-div c1-1 c1-2 c1-s c1-8a[^"]*"[^>]*><\/div>/;

/** Toolbar + custom sort menu (styled like storefront dropdown; behavior wired by ShopSortController). */
const SHOP_TOOLBAR = `<div class="bst-shop-toolbar"><h2 class="bst-shop-toolbar-title">All Products</h2><div class="bst-shop-toolbar-sort"><details class="bst-shop-sort-dropdown"><summary class="bst-shop-sort-trigger"><span class="bst-shop-sort-trigger-label">Most popular</span><span class="bst-shop-sort-caret" aria-hidden="true"></span></summary><ul class="bst-shop-sort-menu" role="listbox" aria-label="Sort products"><li role="none"><button type="button" class="bst-shop-sort-option is-active" role="option" aria-selected="true" data-sort="popular">Most popular</button></li><li role="none"><button type="button" class="bst-shop-sort-option" role="option" aria-selected="false" data-sort="newest">Newest</button></li><li role="none"><button type="button" class="bst-shop-sort-option" role="option" aria-selected="false" data-sort="name-asc">Name (A-Z)</button></li><li role="none"><button type="button" class="bst-shop-sort-option" role="option" aria-selected="false" data-sort="name-desc">Name (Z-A)</button></li><li role="none"><button type="button" class="bst-shop-sort-option" role="option" aria-selected="false" data-sort="price-asc">Price (low to high)</button></li><li role="none"><button type="button" class="bst-shop-sort-option" role="option" aria-selected="false" data-sort="price-desc">Price (high to low)</button></li></ul></details></div></div>`;

function escAttr(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function shopGridHtml(): string {
  const cards = SHOP_PRODUCTS.map(
    (p, index) =>
      `<a href="${escAttr(getProductPathByText(p.title) || "/shop")}" class="bst-shop-card" data-initial-index="${index}" aria-label="${escAttr(p.title)}" style="text-decoration:none;color:inherit"><div class="bst-shop-card-imgwrap"><img src="${escAttr(p.imageSrc)}" alt="${escAttr(p.title)}" width="400" height="400" loading="lazy" decoding="async"/></div><h3 class="bst-shop-card-title">${escAttr(p.title)}</h3><p class="bst-shop-card-price">${escAttr(p.price)}</p></a>`,
  ).join("");
  return `<div class="bst-shop-grid">${cards}</div>`;
}

export function fixShopStorefront(html: string): string {
  if (!html.includes('id="ols-shop-container"')) return html;
  if (!EMPTY_OLS.test(html)) return html;

  return html.replace(
    EMPTY_OLS,
    (_full, breadcrumb: string) =>
      `${breadcrumb}<div data-ux="Block" class="x-el x-el-div c1-1 c1-2 c1-s c1-8a c1-b c1-c c1-d c1-e c1-f c1-g bst-shop-storefront">${SHOP_TOOLBAR}${shopGridHtml()}</div>`,
  );
}
