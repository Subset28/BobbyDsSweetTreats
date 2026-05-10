"use client";

import { useEffect } from "react";
import { subscribeAuth } from "@/lib/firebase/auth";

/**
 * Hides the page immediately, then:
 *  - redirects to /m/login if not signed in
 *  - reveals the page if signed in
 * Render this as a sibling alongside page content, not a wrapper around it.
 */
export function RequireAuth({ redirectTo = "/m/login" }: { redirectTo?: string }) {
  useEffect(() => {
    // Hide page content instantly so unauthenticated users never see a flash
    document.documentElement.style.visibility = "hidden";

    const unsub = subscribeAuth((user) => {
      if (!user) {
        window.location.replace(redirectTo);
      } else {
        document.documentElement.style.visibility = "visible";
      }
    });

    return () => {
      document.documentElement.style.visibility = "visible";
      unsub();
    };
  }, [redirectTo]);

  return null;
}
