"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { attachMembershipScrapeForms } from "@/lib/membershipScrapeForms";
import { SCRAPED_ROOT_ID } from "@/lib/scrapedHtmlRootId";
import { scrapedMirrorOriginPrefixes } from "@/lib/scrapedMirrorOrigins";
import { getProductPath, getProductPathByText } from "@/lib/productCatalog";

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

const mirrorHostSet = mirrorHosts();

/** Normalize any remaining absolute mirror URLs on anchors (matches server-side rewrite). */
function normalizeMirrorAbsoluteAnchors(a: HTMLAnchorElement) {
  const raw = a.getAttribute("href");
  if (!raw || !raw.startsWith("http")) return;
  try {
    const u = new URL(raw);
    if (!mirrorHostSet.has(u.host.toLowerCase())) return;
    const path = `${u.pathname || "/"}${u.search}${u.hash}`;
    if (!a.dataset.originalHref) a.dataset.originalHref = raw;
    a.setAttribute("href", path);
  } catch {
    // ignore
  }
}

/** Legacy storefront cart URLs (path or ?olsPage=cart). */
function isOlsStoreCartLink(href: string): boolean {
  const h = href.trim();
  if (!h) return false;
  const lower = h.toLowerCase();
  if (lower.includes("olspage=cart")) return true;
  if (lower.includes("/shop/ols/cart")) return true;
  try {
    const base =
      typeof window !== "undefined" ? window.location.origin : "http://local.invalid";
    const url = new URL(h, base);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    if (path === "/shop/ols/cart") return true;
  } catch {
    // ignore
  }
  return false;
}

/**
 * Header utilities cart control (not product “add to cart”). The scrape may use `<a>` or `<button>`.
 */
function isShoppingCartUtilitiesControl(el: Element | null): boolean {
  if (!el || el.tagName !== "A") return false;
  const a = el as HTMLAnchorElement;
  const label = (a.getAttribute("aria-label") || "").toLowerCase();
  if (label.includes("shopping cart")) return true;
  if (a.getAttribute("data-page-query") === "olsPage=cart") return true;
  if (
    a.querySelector('[data-aid="CART_ICON_RENDER"]') ||
    a.querySelector('[data-aid*="CART_ICON"]')
  )
    return true;
  return false;
}

/** Cart icon / button in the header utilities strip. */
function isCartUtilitiesClickTarget(target: Element | null): boolean {
  if (!target) return false;
  if (target.closest('[data-aid*="CART_ICON"]')) return true;
  const btn = target.closest("button");
  const al = (btn?.getAttribute("aria-label") || "").toLowerCase();
  if (al.includes("shopping cart")) return true;
  const a = target.closest("a");
  if (a && isShoppingCartUtilitiesControl(a)) return true;
  return false;
}

/** Search control in header utilities (remote JS toggles panels we replace locally). */
function isSearchUtilitiesClickTarget(target: Element | null): boolean {
  if (!target) return false;
  if (target.closest('[data-aid*="SEARCH_ICON"]')) return true;
  const btn = target.closest("button");
  const al = (btn?.getAttribute("aria-label") || "").toLowerCase();
  if (al.includes("search") && !al.includes("shopping")) return true;
  return false;
}

function revealEmbeddedSearchInputs(root: HTMLElement): HTMLInputElement | null {
  const utility =
    root.querySelector<HTMLElement>('[id*="utility-menu" i], [id*="utility-menu"]') ||
    root.querySelector<HTMLElement>('[data-aid="HEADER_NAV_RENDERED"]');
  const scopes = [utility, root].filter(Boolean) as HTMLElement[];
  const selectors =
    'input[type="search"], input[type="text"][placeholder*="search" i], input[name="q"], input[name="query"]';
  for (const scope of scopes) {
    const inputs = scope.querySelectorAll<HTMLInputElement>(selectors);
    for (const input of inputs) {
      if (input.closest(".bst-scraped-search-fallback")) continue;
      let p: HTMLElement | null = input;
      while (p && p !== root) {
        p.hidden = false;
        p.removeAttribute("hidden");
        p.style.removeProperty("display");
        p.style.visibility = "visible";
        p.style.opacity = "1";
        p.style.maxHeight = "none";
        p = p.parentElement;
      }
      input.focus();
      return input;
    }
  }
  return null;
}

function ensureFallbackSearchBar(
  root: HTMLElement,
  runSearch: (q: string) => void,
): HTMLInputElement {
  let wrap = root.querySelector<HTMLElement>(".bst-scraped-search-fallback");
  if (!wrap) {
    const uid = `bst-scraped-search-${Math.random().toString(36).slice(2, 11)}`;
    wrap = document.createElement("div");
    wrap.className = "bst-scraped-search-fallback";
    wrap.setAttribute("role", "search");
    wrap.innerHTML = `<form class="bst-scraped-search-fallback__form" action="#" method="get">
      <label class="bst-visually-hidden" for="${uid}">Search this page</label>
      <input id="${uid}" type="search" name="q" placeholder="Search this page…" autocomplete="off" />
      <button type="submit" class="bst-scraped-search-fallback__submit">Find</button>
    </form>`;
    root.insertBefore(wrap, root.firstChild);
    wrap.querySelector("form")?.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const input = wrap!.querySelector<HTMLInputElement>('input[type="search"]');
      const q = (input?.value || "").trim();
      if (q) runSearch(q);
    });
  }
  wrap.style.display = "block";
  const input = wrap.querySelector<HTMLInputElement>('input[type="search"]')!;
  input.focus();
  return input;
}

function runInPageSearch(rootElement: HTMLElement, rawQuery: string, excludeForm?: HTMLFormElement): boolean {
  const q = rawQuery.trim();
  if (!q) return false;
  const walker = document.createTreeWalker(rootElement, NodeFilter.SHOW_ELEMENT, null);
  let foundEl: HTMLElement | null = null;
  const lower = q.toLowerCase();
  while (walker.nextNode()) {
    const el = walker.currentNode as HTMLElement;
    if (excludeForm && excludeForm.contains(el)) continue;
    if (el.closest?.(".bst-scraped-search-fallback")) continue;
    if ((el.textContent || "").toLowerCase().includes(lower)) {
      foundEl = el;
      break;
    }
  }
  if (foundEl) {
    const hit = foundEl;
    hit.scrollIntoView({ behavior: "smooth", block: "center" });
    hit.style.transition = "background-color 0.3s";
    const orig = hit.style.backgroundColor;
    hit.style.backgroundColor = "#fff59d";
    setTimeout(() => {
      hit.style.backgroundColor = orig;
    }, 1500);
    return true;
  }
  return false;
}

export type ScrapedHtmlProps = {
  html: string;
  className?: string;
  /** Attach Firebase auth handlers to scraped membership forms (login/create-account markup). */
  membershipForms?: "login" | "signup" | null;
};

/**
 * Client-only enhancement for scraped markup: the HTML shell is server-rendered in `ScrapedHtml`
 * so inputs remain visible even if this chunk fails to load.
 */
export function ScrapedHtmlClient({
  html,
  className,
  membershipForms = null,
}: ScrapedHtmlProps) {
  const router = useRouter();
  const membershipChrome = (className ?? "").includes("scraped-membership-page");

  useEffect(() => {
    let cancelled = false;
    let unsub: (() => void) | undefined;

    function apply(loggedIn: boolean) {
      const el = document.getElementById(SCRAPED_ROOT_ID);
      if (!el) return;
      el.dataset.bstAuth = loggedIn ? "1" : "0";

      // Rename "Create Account" link in logged-out dropdown to "Sign up"
      el.querySelectorAll<HTMLAnchorElement>('ul.membership-sign-out a[id*="membership-create"]').forEach((a) => {
        if (a.textContent?.trim() === "Create Account") a.textContent = "Sign up";
      });

      // Show display name or email in logged-in dropdown header
      const emailElement = el.querySelector('[data-aid="MEMBERSHIP_EMAIL_ADDRESS"]');
      if (emailElement) {
        emailElement.textContent = "";
      }
    }

    void import("@/lib/firebase/auth")
      .then(({ subscribeAuth }) => {
        if (cancelled) return;
        unsub = subscribeAuth((user) => {
          if (cancelled) return;
          apply(!!user);

          const el = document.getElementById(SCRAPED_ROOT_ID);
          const emailElement = el?.querySelector('[data-aid="MEMBERSHIP_EMAIL_ADDRESS"]');
          if (emailElement) {
            emailElement.textContent = user?.displayName || user?.email || "";
          }
        });
      })
      .catch(() => {
        /* Firebase chunk failed — keep default header/menu visibility */
      });

    return () => {
      cancelled = true;
      unsub?.();
    };
  }, [html, membershipChrome]);

  useEffect(() => {
    const scrapedRoot = document.getElementById(SCRAPED_ROOT_ID);
    if (!scrapedRoot) return;
    const rootElement: HTMLElement = scrapedRoot;

    function rewriteMembershipLink(a: HTMLAnchorElement) {
      try {
        normalizeMirrorAbsoluteAnchors(a);
        const href = a.getAttribute("href") || "";
        if (isShoppingCartUtilitiesControl(a)) {
          a.dataset.originalHref = href;
          a.setAttribute("href", "/cart");
          return;
        }
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
          href === "/m/login" ||
          href === "/m/orders" ||
          href.includes("/m/account") ||
          href.includes("/m/login") ||
          href.includes("/m/orders") ||
          href.includes("/m/create-account")
        ) {
          a.dataset.originalHref = href;
          if (href.includes("create-account")) {
            a.setAttribute("href", "/m/create-account");
          } else if (href.includes("/m/orders")) {
            a.setAttribute("href", "/m/orders");
          } else if (href.includes("/m/login")) {
            a.setAttribute("href", "/m/login");
          } else {
            a.setAttribute("href", "/m/account");
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
          a.setAttribute("href", "/m/account");
          a.setAttribute("data-auth-link", "true");
          a.setAttribute("aria-label", "Account");
          return;
        }

        if (isOlsStoreCartLink(href)) {
          a.dataset.originalHref = href;
          a.setAttribute("href", "/cart");
        }
      } catch {
        // ignore
      }
    }

    /** Shop route: remove empty popup widgets (promo strip is stripped server-side + CSS). */
    function removeShopPromo() {
      if (!rootElement.closest(".scraped-shop-page")) return;

      rootElement
        .querySelectorAll(".widget-popup, .widget-popup-popup-1")
        .forEach((node) => {
          const el = node as HTMLElement;
          el.remove();
        });
    }

    function setupGallery() {
      const gallery = rootElement.querySelector(
        ".bst-gallery-static[data-bst-gallery='true']",
      ) as HTMLElement | null;
      if (!gallery || gallery.dataset.bstGalleryReady === "true") return;

      const viewport = gallery.querySelector(
        ".carousel-viewport",
      ) as HTMLElement | null;
      const track = gallery.querySelector(
        ".carousel-track",
      ) as HTMLElement | null;
      const slides = [...gallery.querySelectorAll(".carousel-slide")] as HTMLElement[];
      if (!viewport || !track || slides.length === 0) return;

      const thumbButtons = [
        ...gallery.querySelectorAll(
          "[data-thumb-index] button",
        ),
      ] as HTMLButtonElement[];

      gallery
        .querySelectorAll("button")
        .forEach((node) => {
          const el = node as HTMLButtonElement;
          const isThumb = !!el.closest("[data-thumb-index]");
          const isGalleryArrow =
            el.classList.contains("bst-gallery-arrow") ||
            el.classList.contains("carousel-arrow") ||
            el.classList.contains("carousel-left-arrow") ||
            el.classList.contains("carousel-right-arrow") ||
            el.classList.contains("carousel-top-arrow") ||
            el.classList.contains("carousel-bottom-arrow") ||
            el.classList.contains("carousel-arrow-default");
          if (!isThumb && !isGalleryArrow) el.remove();
        });

      gallery
        .querySelectorAll(
          ".carousel-arrow, .carousel-left-arrow, .carousel-right-arrow, .carousel-top-arrow, .carousel-bottom-arrow, .carousel-arrow-default",
        )
        .forEach((node) => node.remove());

      const slideCount = slides.length;
      let activeIndex = slides.findIndex((slide) =>
        slide.classList.contains("carousel-slide-selected"),
      );
      if (activeIndex < 0) activeIndex = 0;

      const controls = document.createElement("div");
      controls.className = "bst-gallery-controls";
      controls.setAttribute("aria-hidden", "false");
      controls.dataset.bstGalleryControls = "true";

      const makeArrow = (direction: "prev" | "next", label: string) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `bst-gallery-arrow bst-gallery-arrow--${direction}`;
        button.dataset.bstGalleryArrow = "true";
        button.setAttribute("aria-label", label);
        button.innerHTML = `
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="${direction === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        `;
        button.addEventListener("click", () => {
          activeIndex = (activeIndex + (direction === "prev" ? -1 : 1) + slideCount) % slideCount;
          render();
          button.blur();
          prevButton.blur();
          nextButton.blur();
        });
        return button;
      };

      const prevButton = makeArrow("prev", "Previous dessert");
      const nextButton = makeArrow("next", "Next dessert");
      controls.append(prevButton, nextButton);
      gallery.appendChild(controls);

      const setThumbState = () => {
        thumbButtons.forEach((button, index) => {
          const isActive = index === activeIndex;
          button.classList.toggle("selected", isActive);
          button.setAttribute("aria-current", isActive ? "true" : "false");
          button.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
      };

      const render = () => {
        const viewportWidth = Math.max(viewport.clientWidth, 320);
        const slideWidth = Math.min(Math.max(viewportWidth * 0.7, 230), 420);
        const slideHeight = Math.min(Math.max(Math.round(slideWidth * 1.4), 350), 600);
        const step = slideWidth + Math.min(24, Math.max(14, Math.round(viewportWidth * 0.018)));

        viewport.style.height = `${slideHeight}px`;
        track.style.height = `${slideHeight}px`;
        track.style.position = "relative";
        track.style.overflow = "visible";

        slides.forEach((slide, idx) => {
          const rawOffset = ((idx - activeIndex) % slideCount + slideCount) % slideCount;
          const offset = rawOffset > slideCount / 2 ? rawOffset - slideCount : rawOffset;
          const distance = Math.abs(offset);
          const scale = distance === 0 ? 1 : distance === 1 ? 0.965 : 0.885;
          const opacity = distance === 0 ? "1" : distance === 1 ? "0.32" : distance === 2 ? "0.12" : "0.04";
          const brightness = distance === 0 ? "1" : distance === 1 ? "0.74" : "0.56";

          slide.style.position = "absolute";
          slide.style.left = "50%";
          slide.style.top = "0";
          slide.style.width = `${slideWidth}px`;
          slide.style.height = `${slideHeight}px`;
          slide.style.marginLeft = "0";
          slide.style.opacity = opacity;
          slide.style.zIndex = String(10 - distance);
          slide.style.transform = `translateX(${offset * step}px) translateX(-50%) scale(${scale})`;
          slide.style.filter = distance === 0 ? "none" : `saturate(0.92) brightness(${brightness})`;
          slide.classList.toggle("carousel-slide-selected", distance === 0);
          slide.classList.toggle("carousel-slide-fade", distance !== 0);
          slide.setAttribute("aria-hidden", distance === 0 ? "false" : "true");
          slide.style.pointerEvents = distance <= 1 ? "auto" : "none";
        });

        setThumbState();
      };

      const pruneLegacyControls = () => {
        gallery.querySelectorAll("button, a, [role='button']").forEach((node) => {
          const el = node as HTMLElement;
          if (el.closest("[data-thumb-index]")) return;
          if (el.dataset.bstGalleryArrow === "true") return;
          if (el.dataset.bstGalleryControls === "true") return;
          if (
            el.classList.contains("bst-gallery-arrow") ||
            el.classList.contains("carousel-arrow") ||
            el.classList.contains("carousel-left-arrow") ||
            el.classList.contains("carousel-right-arrow") ||
            el.classList.contains("carousel-top-arrow") ||
            el.classList.contains("carousel-bottom-arrow") ||
            el.classList.contains("carousel-arrow-default")
          ) {
            el.remove();
            return;
          }

          const label = `${el.getAttribute("aria-label") || ""} ${el.textContent || ""}`.toLowerCase();
          if (label.includes("arrow") || label.includes("next") || label.includes("prev")) {
            el.remove();
          }
        });
      };

      thumbButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
          activeIndex = ((index % slideCount) + slideCount) % slideCount;
          render();
        });
      });

      const onResize = () => {
        render();
      };

      const clearActive = () => {
        prevButton.blur();
        nextButton.blur();
      };

      const mutationObserver = new MutationObserver(() => {
        pruneLegacyControls();
      });

      pruneLegacyControls();
      gallery.addEventListener("mouseleave", clearActive);
      window.addEventListener("resize", onResize);
      mutationObserver.observe(gallery, { childList: true, subtree: true });
      gallery.dataset.bstGalleryReady = "true";
      render();

      return () => {
        window.removeEventListener("resize", onResize);
        gallery.removeEventListener("mouseleave", clearActive);
        mutationObserver.disconnect();
        controls.remove();
        gallery.dataset.bstGalleryReady = "false";
      };
    }

    // Delegate click events for Add to cart buttons and rewritten cart anchors.
    function handleClick(e: MouseEvent) {
      const target = e.target as Element | null;
      if (!target) return;

      const normAnchor = target.closest("a");
      if (normAnchor) normalizeMirrorAbsoluteAnchors(normAnchor as HTMLAnchorElement);

      if (isCartUtilitiesClickTarget(target)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        window.location.assign("/cart");
        return;
      }

      if (isSearchUtilitiesClickTarget(target)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        const embedded = revealEmbeddedSearchInputs(rootElement);
        if (!embedded) {
          ensureFallbackSearchBar(rootElement, (q) => {
            runInPageSearch(rootElement, q);
          });
        }
        return;
      }

      const cartAnchor = target.closest("a");
      if (isShoppingCartUtilitiesControl(cartAnchor)) {
        e.preventDefault();
        e.stopPropagation();
        window.location.assign("/cart");
        return;
      }

      const anchor = target.closest("a") as HTMLAnchorElement | null;
      const href = anchor?.getAttribute("href") || "";
      if (anchor && (href === "/cart" || isOlsStoreCartLink(href))) {
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
      if (!form || form.tagName !== "FORM") return;
      if (!rootElement.contains(form)) return;
      e.preventDefault();
      const input = form.querySelector(
        "input[type=text], input[type=search], input[name=q], input[name=query]",
      ) as HTMLInputElement | null;
      const q = (input?.value || "").trim();
      if (!q) return;
      if (!runInPageSearch(rootElement, q, form)) {
        form.animate?.([{ opacity: 0.6 }, { opacity: 1 }], { duration: 300 });
      }
    }

    // Attach listeners
    let cleanupGallery: (() => void) | undefined;
    let cleanupMembership: (() => void) | undefined;
    try {
      rootElement.querySelectorAll("a").forEach((a) =>
        rewriteMembershipLink(a as HTMLAnchorElement),
      );
      removeShopPromo();
      requestAnimationFrame(() => removeShopPromo());
      cleanupGallery = setupGallery();
      rootElement.addEventListener("click", handleClick, true);
      rootElement
        .querySelectorAll("form")
        .forEach((f) => f.addEventListener("submit", handleSearchSubmit));
      if (membershipForms === "login" || membershipForms === "signup") {
        cleanupMembership = attachMembershipScrapeForms(
          rootElement,
          membershipForms,
          (path) => {
            void router.push(path);
          },
        );
      }
    } catch {
      // ignore
    }

    return () => {
      try {
        rootElement.removeEventListener("click", handleClick, true);
        rootElement
          .querySelectorAll("form")
          .forEach((f) => f.removeEventListener("submit", handleSearchSubmit));
        cleanupGallery?.();
        cleanupMembership?.();
      } catch {
        // ignore
      }
    };
  }, [html, membershipForms, router]);

  return null;
}
