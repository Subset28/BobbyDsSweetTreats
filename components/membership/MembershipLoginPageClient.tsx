"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ScrapedHtml } from "@/components/ScrapedHtml";

type Props = {
  loginHtml: string;
  /** Where to send users who are already signed in (same markup as `/m/login`). */
  redirectWhenAuthed?: string;
};

/**
 * `/m/account` historically shipped the **login** scrape, so signed-in users saw the SSO form.
 * Wait for Firebase persistence, then either redirect authed users or render the login shell.
 */
export function MembershipLoginPageClient({
  loginHtml,
  redirectWhenAuthed = "/m/orders",
}: Props) {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);

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
        if (auth.currentUser) {
          router.replace(redirectWhenAuthed);
          return;
        }

        setShowLogin(true);

        unsub = subscribeAuth((user) => {
          if (cancelled) return;
          if (user) router.replace(redirectWhenAuthed);
        });
      },
    );

    return () => {
      cancelled = true;
      unsub?.();
    };
  }, [router, redirectWhenAuthed]);

  if (!showLogin) {
    return (
      <p
        className="bst-auth-route-status"
        style={{
          margin: 0,
          padding: "2.5rem 1.25rem",
          textAlign: "center",
          fontFamily: "Poppins, Arial, sans-serif",
          color: "var(--site-muted, #6b4e40)",
        }}
        role="status"
        aria-live="polite"
      >
        Checking sign-in…
      </p>
    );
  }

  return (
    <ScrapedHtml
      html={loginHtml}
      className="scraped-membership-page scraped-membership-login"
      membershipForms="login"
    />
  );
}
