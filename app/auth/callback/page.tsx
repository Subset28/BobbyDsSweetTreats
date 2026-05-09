"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getRedirectResult } from "firebase/auth";

import { getFirebaseAuth } from "@/lib/firebase/auth";

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const auth = getFirebaseAuth();
    const nextRaw = searchParams.get("next") ?? "/";
    const safeNext = /^\/(?!\/)/.test(nextRaw) ? nextRaw : "/";

    void getRedirectResult(auth)
      .then(() => {
        router.replace(safeNext);
      })
      .catch(() => {
        router.replace("/login?error=oauth");
      });
  }, [router, searchParams]);

  return (
    <p style={{ padding: 24, fontFamily: "system-ui" }}>Completing sign-in…</p>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <p style={{ padding: 24, fontFamily: "system-ui" }}>Loading…</p>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
}
