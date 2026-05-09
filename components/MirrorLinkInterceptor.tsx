"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { scrapedMirrorOriginPrefixes } from "@/lib/scrapedMirrorOrigins";

/** Catches any remaining absolute mirror URLs (e.g. before hydration) and keeps navigation in-app. */
export function MirrorLinkInterceptor() {
  const router = useRouter();

  useEffect(() => {
    function mirrorHosts(): Set<string> {
      const hosts = new Set<string>();
      for (const p of scrapedMirrorOriginPrefixes()) {
        try {
          hosts.add(new URL(p.endsWith("/") ? p : `${p}/`).host.toLowerCase());
        } catch {
          // ignore
        }
      }
      return hosts;
    }

    const hosts = mirrorHosts();

    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const a = (e.target as Element | null)?.closest("a");
      if (!a?.href) return;

      let url: URL;
      try {
        url = new URL(a.href);
      } catch {
        return;
      }

      if (url.origin === window.location.origin) return;
      if (!hosts.has(url.host.toLowerCase())) return;

      e.preventDefault();
      e.stopPropagation();
      router.push(`${url.pathname}${url.search}${url.hash}`);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return null;
}
