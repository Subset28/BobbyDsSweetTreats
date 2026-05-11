"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { AccountMenu } from "@/components/site/AccountMenu";
import { readCart, type CartItem } from "@/lib/cart";

function cartCount(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(cartCount(readCart()));
    sync();
    window.addEventListener("bds:cart:change", sync);
    return () => window.removeEventListener("bds:cart:change", sync);
  }, []);

  const homeActive = pathname === "/";
  const shopActive = pathname === "/shop" || pathname.startsWith("/shop/");

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__center">
          <div id="logo-container" className="site-header__logo-container">
            <p id="logo-text" className="site-header__logo-heading">
              <Link href="/" className="site-header__logo-link">
                BobbieD&apos;s Sweet Treats
              </Link>
            </p>
          </div>
          <nav className="site-header__nav" aria-label="Primary">
            <Link href="/" data-active={homeActive} aria-current={homeActive ? "page" : undefined}>
              Home
            </Link>
            <Link href="/shop" data-active={shopActive} aria-current={shopActive ? "page" : undefined}>
              Shop
            </Link>
          </nav>
        </div>

        <div className="site-header__utilities">
          <Link
            href="/shop"
            className="site-header__icon"
            aria-label="Search the shop"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
              focusable="false"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3-3" strokeLinecap="round" />
            </svg>
          </Link>
          <Link
            href="/cart"
            className="site-header__icon site-header__icon--cart"
            aria-label="Shopping cart"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M6 7h15l-2 9H8L6 7zm0 0L5 3H2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="20" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="17" cy="20" r="1.5" fill="currentColor" stroke="none" />
            </svg>
            {count > 0 ? (
              <span className="site-header__badge" aria-label={`${count} items in cart`}>
                {count > 99 ? "99+" : count}
              </span>
            ) : null}
          </Link>
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
