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
          try {
            let el = node as HTMLElement;
            let depth = 0;
            const maxDepth = 6;
            while (el.parentElement && depth < maxDepth) {
              const parent = el.parentElement as HTMLElement;
              if (parent.querySelector('[data-aid="HEADER_NAV_RENDERED"]')) break;
              el = parent;
              depth++;
            }
            // Safety: only remove if we didn't climb past the root element or body
            if (el && el !== rootElement && el !== document.body && el.parentElement) {
              el.remove();
            }
          } catch {
            // ignore individual failures
          }
        });
      }

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
    let cleanupGallery: (() => void) | undefined;
    try {
      rootElement.querySelectorAll("a").forEach((a) =>
        rewriteMembershipLink(a as HTMLAnchorElement),
      );
      removeShopPromo();
      cleanupGallery = setupGallery();
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
        cleanupGallery?.();
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
