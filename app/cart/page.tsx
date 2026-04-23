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

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const load = () => {
      setCart(readCart());
    };
    load();
    const onChange = () => load();
    window.addEventListener("bds:cart:change", onChange as EventListener);
    return () => window.removeEventListener("bds:cart:change", onChange as EventListener);
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

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="bst-cart-page">
      <section className="bst-cart-page__shell">
        <div className="bst-cart-page__header">
          <p className="bst-cart-page__eyebrow">Your selections</p>
          <h1>Cart</h1>
          <p>Review your treats, adjust quantities, and keep moving toward checkout.</p>
        </div>

      {cart.length === 0 ? (
          <div className="bst-cart-page__empty">
            <p>Your cart is empty.</p>
            <Link href="/shop" className="bst-cart-page__button">
              Continue shopping
            </Link>
          </div>
      ) : (
          <div className="bst-cart-page__layout">
            <ul className="bst-cart-page__list">
              {cart.map((item, index) => (
                <li key={item.id} className="bst-cart-page__item">
                  {item.imageSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="bst-cart-page__thumb" src={item.imageSrc} alt={item.title} />
                  ) : null}
                  <div className="bst-cart-page__item-body">
                    <div className="bst-cart-page__item-top">
                      <div>
                        <h2>{item.title}</h2>
                        <p>{item.variantLabel}</p>
                        <strong className="bst-cart-page__item-price">
                          {formatPrice(item.price * item.quantity)}
                        </strong>
                      </div>
                    </div>
                    <div className="bst-cart-page__item-controls">
                      <div className="bst-cart-page__quantity">
                        <button
                          type="button"
                          aria-label={`Decrease quantity for ${item.title || item.id}`}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase quantity for ${item.title || item.id}`}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button type="button" className="bst-cart-page__remove" onClick={() => removeItem(index)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="bst-cart-page__summary">
              <h2>Order summary</h2>
              <div className="bst-cart-page__summary-row">
                <span>Items</span>
                <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="bst-cart-page__summary-row bst-cart-page__summary-row--total">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <button type="button" className="bst-cart-page__button bst-cart-page__button--secondary" onClick={clearCart}>
                Clear cart
              </button>
              <button
                type="button"
                className="bst-cart-page__button"
                onClick={() => alert("Checkout is not implemented yet.")}
              >
                Checkout
              </button>
            </aside>
          </div>
      )}
      </section>
    </main>
  );
}
