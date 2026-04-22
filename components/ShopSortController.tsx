"use client";

import { useEffect } from "react";

const SORT_LABELS: Record<string, string> = {
  popular: "Most popular",
  newest: "Newest",
  "name-asc": "Name (A-Z)",
  "name-desc": "Name (Z-A)",
  "price-asc": "Price (low to high)",
  "price-desc": "Price (high to low)",
};

function parsePrices(text: string): number[] {
  return [...text.matchAll(/\$?\s*([\d.]+)/g)].map((m) => parseFloat(m[1]));
}

function minPrice(text: string): number {
  const p = parsePrices(text);
  return p.length ? Math.min(...p) : 0;
}

function maxPrice(text: string): number {
  const p = parsePrices(text);
  return p.length ? Math.max(...p) : 0;
}

export function ShopSortController() {
  useEffect(() => {
    const root = document.querySelector(".scraped-shop-page");
    if (!root) return;

    const grid = root.querySelector(".bst-shop-grid");
    const details = root.querySelector(
      ".bst-shop-sort-dropdown",
    ) as HTMLDetailsElement | null;
    if (!grid || !details) return;

    const triggerLabel = root.querySelector(".bst-shop-sort-trigger-label");
    const options = root.querySelectorAll<HTMLButtonElement>(
      ".bst-shop-sort-option",
    );

    const getCards = (): HTMLElement[] =>
      [...grid.querySelectorAll(".bst-shop-card")] as HTMLElement[];

    const sortBy = (mode: string) => {
      const cards = getCards();
      const compareIndex = (a: HTMLElement, b: HTMLElement) => {
        const ia = Number(a.dataset.initialIndex ?? 0);
        const ib = Number(b.dataset.initialIndex ?? 0);
        return ia - ib;
      };

      const titleOf = (el: HTMLElement) =>
        el.querySelector(".bst-shop-card-title")?.textContent?.trim() ?? "";

      const priceEl = (el: HTMLElement) =>
        el.querySelector(".bst-shop-card-price")?.textContent ?? "";

      let sorted: HTMLElement[];

      switch (mode) {
        case "popular":
          sorted = [...cards].sort(compareIndex);
          break;
        case "newest":
          sorted = [...cards].sort(
            (a, b) => compareIndex(b, a),
          );
          break;
        case "name-asc":
          sorted = [...cards].sort((a, b) =>
            titleOf(a).localeCompare(titleOf(b), undefined, {
              sensitivity: "base",
            }),
          );
          break;
        case "name-desc":
          sorted = [...cards].sort((a, b) =>
            titleOf(b).localeCompare(titleOf(a), undefined, {
              sensitivity: "base",
            }),
          );
          break;
        case "price-asc":
          sorted = [...cards].sort(
            (a, b) => minPrice(priceEl(a)) - minPrice(priceEl(b)),
          );
          break;
        case "price-desc":
          sorted = [...cards].sort(
            (a, b) => maxPrice(priceEl(b)) - maxPrice(priceEl(a)),
          );
          break;
        default:
          sorted = [...cards].sort(compareIndex);
      }

      for (const card of sorted) {
        grid.appendChild(card);
      }
    };

    const setActive = (active: HTMLButtonElement) => {
      for (const btn of options) {
        const isSel = btn === active;
        btn.classList.toggle("is-active", isSel);
        btn.setAttribute("aria-selected", isSel ? "true" : "false");
      }
      const label = SORT_LABELS[active.dataset.sort ?? "popular"] ?? "Most popular";
      if (triggerLabel) {
        triggerLabel.textContent = label;
      }
      sortBy(active.dataset.sort ?? "popular");
      details.open = false;
    };

    const onOptionClick = (e: Event) => {
      const t = e.target as HTMLElement | null;
      const btn = t?.closest("button.bst-shop-sort-option") as
        | HTMLButtonElement
        | undefined;
      if (!btn || !root.contains(btn)) return;
      e.preventDefault();
      setActive(btn);
    };

    root.addEventListener("click", onOptionClick);

    const onDocPointerDown = (e: PointerEvent) => {
      if (!details.open) return;
      const t = e.target as Node | null;
      if (t && !details.contains(t)) {
        details.open = false;
      }
    };

    document.addEventListener("pointerdown", onDocPointerDown);

    return () => {
      root.removeEventListener("click", onOptionClick);
      document.removeEventListener("pointerdown", onDocPointerDown);
    };
  }, []);

  return null;
}
