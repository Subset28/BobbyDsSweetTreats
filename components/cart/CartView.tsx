"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  type CartItem,
  emitCartChange,
  readCart,
  saveCart,
  updateCartItemQuantity,
} from "@/lib/cart";
import {
  computeCheckoutTotals,
  formatTaxPercentLabel,
  PRIORITY_MAIL_FLAT_USD,
  SALES_TAX_RATE,
} from "@/lib/checkoutTotals";

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

function usdLabel(value: number): string {
  return `${formatPrice(value)} USD`;
}

export function CartView() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const load = () => setCart(readCart());
    load();
    const onChange = () => load();
    window.addEventListener("bds:cart:change", onChange as EventListener);
    return () =>
      window.removeEventListener("bds:cart:change", onChange as EventListener);
  }, []);

  function sync(next: CartItem[]) {
    setCart(next);
    saveCart(next);
    emitCartChange(next);
  }

  function removeItem(index: number) {
    const next = [...cart];
    next.splice(index, 1);
    sync(next);
  }

  function updateQuantity(id: string, quantity: number) {
    sync(updateCartItemQuantity(cart, id, quantity));
  }

  function clearCart() {
    sync([]);
  }

  const { subtotal, priorityMail, estimatedTax, total } =
    computeCheckoutTotals(cart);

  return (
    <div className="bst-ols-cart">
      <nav className="bst-ols-cart__nav" aria-label="Cart">
        <Link href="/shop" className="bst-ols-cart__continue">
          ◀ Continue shopping
        </Link>
      </nav>

      {cart.length === 0 ? (
        <p className="bst-ols-cart__empty">Your cart is empty.</p>
      ) : (
        <>
          <div className="bst-ols-cart__table-scroll">
            <table className="bst-ols-cart__table">
              <thead>
                <tr>
                  <th className="bst-ols-cart__th-spacer" scope="col" />
                  <th className="bst-ols-cart__th-num" scope="col">
                    Price
                  </th>
                  <th className="bst-ols-cart__th-qty" scope="col">
                    Quantity
                  </th>
                  <th className="bst-ols-cart__th-num" scope="col">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={item.id}>
                    <td className="bst-ols-cart__td-product">
                      <div className="bst-ols-cart__product">
                        {item.imageSrc ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            className="bst-ols-cart__thumb"
                            src={item.imageSrc}
                            alt=""
                            width={72}
                            height={72}
                          />
                        ) : (
                          <span
                            className="bst-ols-cart__thumb bst-ols-cart__thumb--placeholder"
                            aria-hidden
                          />
                        )}
                        <div className="bst-ols-cart__product-text">
                          <div className="bst-ols-cart__title">{item.title}</div>
                          {item.variantLabel ? (
                            <div className="bst-ols-cart__variant">
                              {item.variantLabel}
                            </div>
                          ) : null}
                          <div className="bst-ols-cart__mobile-unit">
                            {usdLabel(item.price)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="bst-ols-cart__td-unit">
                      {usdLabel(item.price)}
                    </td>
                    <td className="bst-ols-cart__td-qty">
                      <div className="bst-ols-cart__qty-cell">
                        <input
                          className="bst-ols-cart__qty-input"
                          type="number"
                          min={1}
                          step={1}
                          aria-label={`Quantity for ${item.title}`}
                          value={item.quantity}
                          onChange={(event) => {
                            const n = Number.parseInt(event.target.value, 10);
                            if (!Number.isFinite(n) || n < 1) return;
                            updateQuantity(item.id, n);
                          }}
                        />
                        <button
                          type="button"
                          className="bst-ols-cart__remove-x"
                          aria-label={`Remove ${item.title}`}
                          onClick={() => removeItem(index)}
                        >
                          ×
                        </button>
                      </div>
                    </td>
                    <td className="bst-ols-cart__td-line">
                      {usdLabel(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bst-ols-cart__summary">
            <div className="bst-ols-cart__totals">
              <div className="bst-ols-cart__subline">
                <span>Subtotal</span>
                <strong>{usdLabel(subtotal)}</strong>
              </div>
              {priorityMail > 0 ? (
                <div className="bst-ols-cart__subline">
                  <span>USPS Priority Mail</span>
                  <span>{usdLabel(priorityMail)}</span>
                </div>
              ) : null}
              <div className="bst-ols-cart__subline">
                <span>
                  Estimated sales tax ({formatTaxPercentLabel(SALES_TAX_RATE)})
                </span>
                <span>{usdLabel(estimatedTax)}</span>
              </div>
              <div className="bst-ols-cart__subline bst-ols-cart__subline--grand">
                <span>Estimated total</span>
                <strong>{usdLabel(total)}</strong>
              </div>
            </div>
            <p className="bst-ols-cart__note">
              {`Chocolate-covered fruit ships USPS Priority Mail ($${PRIORITY_MAIL_FLAT_USD}). Estimated tax applies to items and Priority Mail when applicable. Final tax may vary.`}
            </p>
            <div className="bst-ols-cart__actions">
              <button
                type="button"
                className="bst-ols-cart__linkish"
                onClick={() => sync(readCart())}
              >
                Update cart
              </button>
              <button
                type="button"
                className="bst-ols-cart__linkish"
                onClick={clearCart}
              >
                Clear cart
              </button>
            </div>
            <button
              type="button"
              className="bst-ols-cart__checkout"
              onClick={() =>
                window.alert(
                  `Estimated total: ${usdLabel(total)}\n\nIncludes ${formatTaxPercentLabel(SALES_TAX_RATE)} estimated sales tax. ${priorityMail > 0 ? `Priority Mail ${usdLabel(priorityMail)} included.` : "No Priority Mail (no chocolate-covered fruit in cart)."}\n\nWe’ll confirm payment and shipping with you directly.`,
                )
              }
            >
              CHECKOUT
            </button>
          </div>
        </>
      )}
    </div>
  );
}
