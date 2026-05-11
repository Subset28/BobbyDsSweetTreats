"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { User } from "firebase/auth";

type Phase = "checking" | "ready";

export function MembershipOrdersApp() {
  const [phase, setPhase] = useState<Phase>("checking");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    document.body.classList.add("bst-orders-route");
    return () => {
      document.body.classList.remove("bst-orders-route");
    };
  }, []);

  const redirectGuest = useCallback(() => {
    window.location.replace("/m/login");
  }, []);

  useEffect(() => {
    let cancelled = false;
    let unsub: (() => void) | undefined;

    void import("@/lib/firebase/auth").then(
      async ({ authStateReady, getFirebaseAuth, subscribeAuth }) => {
        try {
          await authStateReady();
        } catch {
          /* ignore */
        }
        if (cancelled) return;

        const auth = getFirebaseAuth();
        if (!auth.currentUser) {
          redirectGuest();
          return;
        }

        setUser(auth.currentUser);
        if (!cancelled) setPhase("ready");

        unsub = subscribeAuth((next) => {
          if (!next) redirectGuest();
          else setUser(next);
        });
      },
    );

    return () => {
      cancelled = true;
      unsub?.();
    };
  }, [redirectGuest]);

  const handleSignOut = async () => {
    try {
      const { signOutFirebase } = await import("@/lib/firebase/auth");
      await signOutFirebase();
    } catch {
      /* ignore */
    }
    window.location.href = "/m/login";
  };

  if (phase === "checking") {
    return (
      <div className="bst-orders-app bst-orders-app--gate" role="status" aria-live="polite" aria-busy="true">
        <p className="bst-orders-app__gate-text">Checking your session…</p>
      </div>
    );
  }

  const label = user?.displayName?.trim() || user?.email || "Account";

  return (
    <div className="bst-orders-app">
      <main className="bst-orders-app__main">
        <div className="bst-orders-app__meta">
          <nav className="bst-orders-app__links" aria-label="Site">
            <Link href="/">Home</Link>
            <span className="bst-orders-app__sep" aria-hidden="true">
              ·
            </span>
            <Link href="/shop">Shop</Link>
            <span className="bst-orders-app__sep" aria-hidden="true">
              ·
            </span>
            <Link href="/cart">Cart</Link>
          </nav>
          <button type="button" className="bst-orders-app__signout" onClick={() => void handleSignOut()}>
            Sign out
          </button>
        </div>
        <p className="bst-orders-app__signed-in">Signed in as {label}</p>

        <h1 className="bst-orders-app__heading">Your orders</h1>
        <p className="bst-orders-app__lead">
          Online order history isn&apos;t connected here yet. For order questions or custom treats,
          reach out and we&apos;ll help you directly.
        </p>
        <div className="bst-orders-app__card">
          <p className="bst-orders-app__card-text">
            Browse the shop for pickup-style treats, or email us about custom orders.
          </p>
          <div className="bst-orders-app__card-actions">
            <Link href="/shop" className="bst-orders-app__btn bst-orders-app__btn--primary">
              Go to shop
            </Link>
            <a href="mailto:bobbied.sweettreats@gmail.com" className="bst-orders-app__btn bst-orders-app__btn--ghost">
              Email the bakery
            </a>
          </div>
        </div>
      </main>

      <footer className="bst-orders-app__footer">
        <Link href="/">← Back to home</Link>
      </footer>
    </div>
  );
}
