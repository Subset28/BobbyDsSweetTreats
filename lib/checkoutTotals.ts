import type { CartItem } from "./cart";

/** USPS Priority Mail flat rate when the order includes chocolate-covered fruit. */
export const PRIORITY_MAIL_FLAT_USD = 22;

/**
 * Estimated combined sales tax rate applied to merchandise + Priority Mail (when charged).
 * Replace with your jurisdiction’s rate (state + local); confirm with your tax professional.
 */
export const SALES_TAX_RATE = 0.06625;

/** Product slugs that include chocolate-covered fruit and ship Priority Mail. */
const PRIORITY_MAIL_SLUGS = new Set<string>([
  "a-dozen-chocolate-covered-strawberries",
  "chocolate-strawberry-bouquet",
  "chocolate-covered-strawberries-gift-box",
  "valentines-day-treat-box",
  "special-valentines-day-set",
]);

function titleImpliesChocolateCoveredFruit(title: string): boolean {
  const t = title.toLowerCase();
  return (
    t.includes("chocolate covered strawberry") ||
    t.includes("chocolate-covered strawberry") ||
    (t.includes("strawberry") && t.includes("bouquet")) ||
    (t.includes("strawberry") && t.includes("gift box"))
  );
}

export function cartIncludesChocolateCoveredFruit(cart: CartItem[]): boolean {
  return cart.some(
    (item) =>
      PRIORITY_MAIL_SLUGS.has(item.slug) ||
      titleImpliesChocolateCoveredFruit(item.title),
  );
}

export type CheckoutTotals = {
  subtotal: number;
  priorityMail: number;
  taxableBase: number;
  estimatedTax: number;
  total: number;
};

export function computeCheckoutTotals(cart: CartItem[]): CheckoutTotals {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const priorityMail = cartIncludesChocolateCoveredFruit(cart)
    ? PRIORITY_MAIL_FLAT_USD
    : 0;
  const taxableBase = subtotal + priorityMail;
  const estimatedTax = taxableBase * SALES_TAX_RATE;
  const total = taxableBase + estimatedTax;
  return {
    subtotal,
    priorityMail,
    taxableBase,
    estimatedTax,
    total,
  };
}

export function formatTaxPercentLabel(rate: number = SALES_TAX_RATE): string {
  return `${(rate * 100).toFixed(2)}%`;
}
