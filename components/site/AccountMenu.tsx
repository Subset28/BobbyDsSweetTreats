"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { signOutFirebase, subscribeAuth } from "@/lib/firebase/auth";

export function AccountMenu() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsub = subscribeAuth((user) => {
      setSignedIn(!!user);
      setDisplayName(user?.displayName || user?.email || null);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node | null;
      if (wrapperRef.current && target && !wrapperRef.current.contains(target)) {
        setOpen(false);
      }
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  async function handleSignOut() {
    setOpen(false);
    try {
      await signOutFirebase();
    } catch {
      // ignore — auth state listener will sync regardless
    }
  }

  return (
    <div className="site-header__menu" ref={wrapperRef}>
      <button
        type="button"
        className="site-header__icon"
        aria-label="Account"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
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
          <circle cx="12" cy="9" r="4" />
          <path d="M5 20c1.7-4 12.3-4 14 0" strokeLinecap="round" />
        </svg>
      </button>

      {open ? (
        <div className="site-header__menu-panel" role="menu">
          {signedIn ? (
            <>
              {displayName ? (
                <p className="site-header__menu-name" aria-hidden="true">
                  {displayName}
                </p>
              ) : null}
              <Link
                href="/m/orders"
                className="site-header__menu-item"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                My orders
              </Link>
              <Link
                href="/m/account"
                className="site-header__menu-item"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                My account
              </Link>
              <button
                type="button"
                className="site-header__menu-item site-header__menu-item--button"
                role="menuitem"
                onClick={handleSignOut}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="site-header__menu-item"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="site-header__menu-item"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
