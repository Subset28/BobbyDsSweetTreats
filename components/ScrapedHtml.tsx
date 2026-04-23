"use client";

import { useEffect, useRef } from "react";

import { getProductPath, getProductPathByText } from "@/lib/productCatalog";

type Props = { html: string; className?: string };

/** Full-width block wrapper; avoid `display: contents` (flex bugs in some engines). */
export function ScrapedHtml({ html, className }: Props) {
  const rootClass =
    className?.trim().length ?? 0
      ? `scraped-root ${className}`
      : "scraped-root";
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const rootElement = root;

    // Intercept header links that still point to the original GoDaddy membership flows.
    function rewriteMembershipLink(a: HTMLAnchorElement) {
      try {
        const href = a.getAttribute("href") || "";
        const text = (a.textContent || "").trim().toLowerCase();
        const productMatch = href.match(/\/shop\/ols\/products\/([^/?#]+)/i);
        if (productMatch) {
          a.dataset.originalHref = href;
          a.setAttribute("href", getProductPath(productMatch[1]));
          a.setAttribute("data-product-link", "true");
          return;
        }

        const productPath = getProductPathByText(a.textContent || "");
        if (
          productPath &&
          (a.closest(".bst-featured-card") ||
            a.closest(".bst-shop-card") ||
            a.getAttribute("data-aid")?.includes("PRODUCT") ||
            a.getAttribute("data-aid")?.includes("MENU_ITEM") ||
            text === "strawberries" ||
            text.includes("cake pop") ||
            text.includes("brownie") ||
            text.includes("oreo") ||
            text.includes("pretzel") ||
            text.includes("bark") ||
            text.includes("bouquet"))
        ) {
          a.dataset.originalHref = href;
          a.setAttribute("href", productPath);
          a.setAttribute("data-product-link", "true");
          return;
        }

        if (
          href === "/m/account" ||
          href === "/m/orders" ||
          href.includes("/m/account") ||
          href.includes("/m/orders") ||
          href.includes("/m/create-account")
        ) {
          a.dataset.originalHref = href;
          if (href.includes("create-account")) {
            a.setAttribute("href", "/signup");
          } else {
            a.setAttribute("href", "/login");
          }
          a.setAttribute("data-auth-link", "true");
          a.setAttribute("aria-label", "Account");
          return;
        }

        if (
          a.getAttribute("data-aid") === "HEADER_CTA_BTN" ||
          text === "order now"
        ) {
          a.dataset.originalHref = href;
          a.setAttribute("href", "/shop");
          a.setAttribute("aria-label", "Shop");
          return;
        }

        if (
          href === "#" &&
          a.getAttribute("data-aid") === "MEMBERSHIP_ICON_DESKTOP_RENDERED"
        ) {
          a.dataset.originalHref = href;
          a.setAttribute("href", "/login");
          a.setAttribute("data-auth-link", "true");
          a.setAttribute("aria-label", "Account");
          return;
        }

        if (
          href.includes("olsPage=cart") ||
          href.includes("/shop?olsPage=cart") ||
          href.includes("bobbiedsweettreats.com/shop")
        ) {
          a.dataset.originalHref = href;
          a.setAttribute("href", "/cart");
        }
      } catch {
        // ignore
      }
    }

    function removeShopPromo() {
      if (!rootElement.closest(".scraped-shop-page")) return;

      const promoMarkers = [
        '[data-aid="HEADER_CTA_BTN"]',
        '[data-aid="HEADER_TAGLINE1_RENDERED"]',
        '[data-aid="HEADER_TAGLINE2_RENDERED"]',
      ];

      for (const selector of promoMarkers) {
        rootElement.querySelectorAll(selector).forEach((node) => {
          let el = node as HTMLElement;
          while (el.parentElement) {
            const parent = el.parentElement as HTMLElement;
            if (parent.querySelector('[data-aid="HEADER_NAV_RENDERED"]')) break;
            el = parent;
          }
          el.remove();
        });
      }

      rootElement
        .querySelectorAll(".widget-popup, .widget-popup-popup-1")
        .forEach((node) => {
          const el = node as HTMLElement;
          el.remove();
        });
    }

    // Delegate click events for Add to cart buttons and rewritten cart anchors.
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (anchor && anchor.getAttribute("href") === "/cart") {
        // Internalize cart navigation
        e.preventDefault();
        window.location.pathname = "/cart";
        return;
      }

      const btn = target.closest("button, a") as HTMLElement | null;
      if (btn) {
        const txt = (btn.textContent || "").trim().toLowerCase();
        if (txt.includes("add to cart") || txt.includes("add to bag") || txt.includes("add to order")) {
          e.preventDefault();
          // Extract a best-effort product id or title from nearby markup
          const productEl = btn.closest("[data-product-id], .product, .product-item, [data-ols-product-id]") as HTMLElement | null;
          const title =
            productEl?.querySelector("h1,h2,h3,h4,.product-title")?.textContent?.trim() ||
            productEl?.getAttribute("data-product-id") ||
            btn.getAttribute("data-product-id") ||
            "unknown product";
          const item = { id: productEl?.getAttribute("data-product-id") || title, title };
          try {
            const cart = JSON.parse(localStorage.getItem("bds_cart" ) || "[]");
            cart.push(item);
            localStorage.setItem("bds_cart", JSON.stringify(cart));
            window.dispatchEvent(new CustomEvent("bds:cart:change", { detail: { cart } }));
            // simple feedback
            btn.animate?.([{ transform: "scale(1.02)" }, { transform: "scale(1)" }], { duration: 200 });
          } catch (err) {
            console.error("Add to cart failed", err);
          }
        }
      }
    }

    // Simple search: find first element containing query and jump to it.
    function handleSearchSubmit(e: Event) {
      const form = e.target as HTMLFormElement | null;
      if (!form) return;
      if (!rootElement.contains(form)) return;
      e.preventDefault();
      const input = form.querySelector("input[type=text], input[type=search], input[name=q], input[name=query]") as HTMLInputElement | null;
      const q = (input?.value || "").trim();
      if (!q) return;
      const walker = document.createTreeWalker(
        rootElement,
        NodeFilter.SHOW_ELEMENT,
        null,
      );
      let foundEl: HTMLElement | null = null;
      while (walker.nextNode()) {
        const el = walker.currentNode as HTMLElement;
        if (el === form) continue;
        if ((el.textContent || "").toLowerCase().includes(q.toLowerCase())) {
          foundEl = el;
          break;
        }
      }
      if (foundEl) {
        foundEl.scrollIntoView({ behavior: "smooth", block: "center" });
        foundEl.style.transition = "background-color 0.3s";
        const orig = foundEl.style.backgroundColor;
        foundEl.style.backgroundColor = "#fff59d";
        setTimeout(() => (foundEl!.style.backgroundColor = orig), 1500);
      } else {
        // no results: briefly flash header or form
        form.animate?.([{ opacity: 0.6 }, { opacity: 1 }], { duration: 300 });
      }
    }

    // Attach listeners
    try {
      rootElement.querySelectorAll("a").forEach((a) =>
        rewriteMembershipLink(a as HTMLAnchorElement),
      );
      removeShopPromo();
      const observer = new MutationObserver(() => removeShopPromo());
      observer.observe(rootElement, { childList: true, subtree: true });
      (rootElement as HTMLElement & { __scrapedObserver?: MutationObserver }).__scrapedObserver =
        observer;
      rootElement.addEventListener("click", handleClick);
      rootElement
        .querySelectorAll("form")
        .forEach((f) => f.addEventListener("submit", handleSearchSubmit));
    } catch {
      // ignore
    }

    return () => {
      try {
        rootElement.removeEventListener("click", handleClick);
        rootElement
          .querySelectorAll("form")
          .forEach((f) => f.removeEventListener("submit", handleSearchSubmit));
        const observer = (rootElement as HTMLElement & { __scrapedObserver?: MutationObserver }).__scrapedObserver;
        observer?.disconnect();
        if (observer) {
          delete (rootElement as HTMLElement & { __scrapedObserver?: MutationObserver }).__scrapedObserver;
        }
      } catch {
        // ignore
      }
    };
  }, [html]);

  return (
    <div
      ref={containerRef}
      className={rootClass}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
