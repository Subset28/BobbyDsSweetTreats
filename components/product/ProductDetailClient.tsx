"use client";

import Link from "next/link";
import { useState } from "react";

import type { ProductCatalogItem } from "@/lib/productCatalog";
import {
  addToCart,
  emitCartChange,
  readCart,
  saveCart,
} from "@/lib/cart";

type Props = {
  product: ProductCatalogItem;
};

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function ProductDetailClient({ product }: Props) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "default");
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState<string | null>(null);

  const variant = product.variants.find((entry) => entry.id === variantId) ?? product.variants[0];
  const unitPrice = variant?.price ?? product.price;
  const lineTotal = unitPrice * quantity;

  const handleAdd = () => {
    if (!variant) return;

    const cart = readCart();
    const next = addToCart(cart, {
      slug: product.slug,
      title: product.title,
      variantId: variant.id,
      variantLabel: variant.label,
      price: variant.price,
      quantity,
      imageSrc: product.image,
      description: product.description,
    });

    saveCart(next);
    emitCartChange(next);
    setNotice(`${product.title} added to your cart.`);
  };

  return (
    <div className="bst-product-detail">
      <div className="bst-product-detail__eyebrow">Fresh from Bobbie D&apos;s Sweet Treats</div>
      <h1 className="bst-product-detail__title">{product.title}</h1>
      <p className="bst-product-detail__price" aria-live="polite">
        {formatPrice(lineTotal)}
      </p>
      <p className="bst-product-detail__unit-price">
        {formatPrice(unitPrice)} each
      </p>
      <p className="bst-product-detail__description">{product.description}</p>

      <div className="bst-product-detail__field">
        <div className="bst-product-detail__label">Size</div>
        <div className="bst-product-detail__variant-list" role="radiogroup" aria-label="Size options">
          {product.variants.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className={`bst-product-detail__variant${entry.id === variantId ? " is-active" : ""}`}
              aria-pressed={entry.id === variantId}
              onClick={() => setVariantId(entry.id)}
            >
              <span>{entry.label}</span>
              <span>{formatPrice(entry.price)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bst-product-detail__field">
        <div className="bst-product-detail__label">Quantity</div>
        <div className="bst-product-detail__quantity">
          <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity">
            -
          </button>
          <span>{quantity}</span>
          <button type="button" onClick={() => setQuantity((value) => value + 1)} aria-label="Increase quantity">
            +
          </button>
        </div>
      </div>

      <div className="bst-product-detail__actions">
        <button type="button" className="bst-product-detail__add" onClick={handleAdd}>
          Add to cart
        </button>
        <Link href="/cart" className="bst-product-detail__cart-link">
          View cart
        </Link>
      </div>

      {notice ? (
        <p className="bst-product-detail__notice" role="status" aria-live="polite">
          {notice}
        </p>
      ) : null}

      {variant?.description ? (
        <p className="bst-product-detail__variant-note">{variant.description}</p>
      ) : null}
    </div>
  );
}
