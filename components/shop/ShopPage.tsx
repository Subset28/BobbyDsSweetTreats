"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { getProductPathByText } from "@/lib/productCatalog";
import { SHOP_PRODUCTS, type ShopProduct } from "@/lib/shopProducts";

type SortMode =
  | "popular"
  | "newest"
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc";

const SORT_OPTIONS: ReadonlyArray<{ id: SortMode; label: string }> = [
  { id: "popular", label: "Most popular" },
  { id: "newest", label: "Newest" },
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "price-asc", label: "Price (low to high)" },
  { id: "price-desc", label: "Price (high to low)" },
];

const SORT_LABELS: Record<SortMode, string> = Object.fromEntries(
  SORT_OPTIONS.map((option) => [option.id, option.label]),
) as Record<SortMode, string>;

function parsePrices(text: string): number[] {
  return [...text.matchAll(/\$?\s*([\d.]+)/g)].map((m) => parseFloat(m[1]));
}

function minPrice(text: string): number {
  const prices = parsePrices(text);
  return prices.length ? Math.min(...prices) : 0;
}

function maxPrice(text: string): number {
  const prices = parsePrices(text);
  return prices.length ? Math.max(...prices) : 0;
}

type IndexedProduct = ShopProduct & { initialIndex: number };

const PRODUCTS: IndexedProduct[] = SHOP_PRODUCTS.map((product, index) => ({
  ...product,
  initialIndex: index,
}));

function compareByIndex(a: IndexedProduct, b: IndexedProduct): number {
  return a.initialIndex - b.initialIndex;
}

function sortProducts(items: IndexedProduct[], mode: SortMode): IndexedProduct[] {
  const next = [...items];
  switch (mode) {
    case "popular":
      return next.sort(compareByIndex);
    case "newest":
      return next.sort((a, b) => b.initialIndex - a.initialIndex);
    case "name-asc":
      return next.sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
      );
    case "name-desc":
      return next.sort((a, b) =>
        b.title.localeCompare(a.title, undefined, { sensitivity: "base" }),
      );
    case "price-asc":
      return next.sort((a, b) => minPrice(a.price) - minPrice(b.price));
    case "price-desc":
      return next.sort((a, b) => maxPrice(b.price) - maxPrice(a.price));
    default:
      return next.sort(compareByIndex);
  }
}

export function ShopPage() {
  const [sort, setSort] = useState<SortMode>("popular");
  const [query, setQuery] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDetailsElement | null>(null);

  useEffect(() => {
    if (!sortOpen) return;
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node | null;
      if (sortRef.current && target && !sortRef.current.contains(target)) {
        setSortOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setSortOpen(false);
    }
    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKey);
    };
  }, [sortOpen]);

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = normalized
      ? PRODUCTS.filter((p) => p.title.toLowerCase().includes(normalized))
      : PRODUCTS;
    return sortProducts(filtered, sort);
  }, [query, sort]);

  return (
    <div className="bst-shop-storefront">
      <div className="bst-shop-toolbar">
        <h2 className="bst-shop-toolbar-title">All Products</h2>
        <div className="bst-shop-toolbar-controls">
          <label className="bst-shop-search" aria-label="Search products">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
              focusable="false"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3-3" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
              autoComplete="off"
            />
          </label>

          <details
            ref={sortRef}
            className="bst-shop-sort-dropdown"
            open={sortOpen}
            onToggle={(event) =>
              setSortOpen((event.currentTarget as HTMLDetailsElement).open)
            }
          >
            <summary className="bst-shop-sort-trigger">
              <span className="bst-shop-sort-trigger-label">
                {SORT_LABELS[sort]}
              </span>
              <span className="bst-shop-sort-caret" aria-hidden="true" />
            </summary>
            <ul
              className="bst-shop-sort-menu"
              role="listbox"
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((option) => (
                <li key={option.id} role="none">
                  <button
                    type="button"
                    className={
                      option.id === sort
                        ? "bst-shop-sort-option is-active"
                        : "bst-shop-sort-option"
                    }
                    role="option"
                    aria-selected={option.id === sort}
                    onClick={() => {
                      setSort(option.id);
                      setSortOpen(false);
                    }}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="bst-shop-empty" role="status">
          No products match &ldquo;{query}&rdquo;. Try a different search.
        </p>
      ) : (
        <ul className="bst-shop-grid" aria-live="polite">
          {visible.map((product) => {
            const href = getProductPathByText(product.title) ?? "/shop";
            return (
              <li key={product.title}>
                <Link
                  href={href}
                  className="bst-shop-card"
                  aria-label={product.title}
                >
                  <div className="bst-shop-card-imgwrap">
                    <Image
                      src={product.imageSrc}
                      alt={product.title}
                      width={400}
                      height={400}
                      sizes="(max-width: 520px) 90vw, (max-width: 900px) 45vw, 30vw"
                    />
                  </div>
                  <h3 className="bst-shop-card-title">{product.title}</h3>
                  <p className="bst-shop-card-price">{product.price}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
