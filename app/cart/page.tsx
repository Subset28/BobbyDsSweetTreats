"use client";

import { useEffect, useState } from "react";

type CartItem = { id: string; title: string };

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const load = () => {
      try {
        const stored = JSON.parse(localStorage.getItem("bds_cart") || "[]");
        setCart(stored);
      } catch {
        setCart([]);
      }
    };
    load();
    const onChange = () => load();
    window.addEventListener("bds:cart:change", onChange as EventListener);
    return () => window.removeEventListener("bds:cart:change", onChange as EventListener);
  }, []);

  function removeItem(index: number) {
    const next = [...cart];
    next.splice(index, 1);
    setCart(next);
    localStorage.setItem("bds_cart", JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("bds:cart:change", { detail: { cart: next } }));
  }

  function clearCart() {
    setCart([]);
    localStorage.removeItem("bds_cart");
    window.dispatchEvent(new CustomEvent("bds:cart:change", { detail: { cart: [] } }));
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cart.map((it, i) => (
            <li key={`${it.id}-${i}`} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ flex: 1 }}>{it.title}</div>
                <button onClick={() => removeItem(i)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div style={{ marginTop: 18 }}>
        <button onClick={clearCart} style={{ marginRight: 12 }}>
          Clear
        </button>
        <button
          onClick={() => alert("Checkout not implemented. Will integrate with Supabase on request.")}
          disabled={cart.length === 0}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
