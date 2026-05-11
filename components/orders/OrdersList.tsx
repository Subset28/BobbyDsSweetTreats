"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { subscribeAuth } from "@/lib/firebase/auth";
import { subscribeMyOrders, type Order } from "@/lib/firebase/orders";

type LoadState = "loading" | "ready" | "error";

const formatCurrency = (value: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(value);

const formatDate = (date: Date | null) =>
  date
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date)
    : "—";

const STATUS_LABEL: Record<Order["status"], string> = {
  pending: "Pending",
  paid: "Paid",
  fulfilled: "Fulfilled",
  cancelled: "Cancelled",
};

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let unsubOrders: (() => void) | undefined;
    const unsubAuth = subscribeAuth((user) => {
      unsubOrders?.();
      unsubOrders = undefined;
      if (!user) {
        setOrders([]);
        setState("loading");
        return;
      }
      setState("loading");
      unsubOrders = subscribeMyOrders(
        user.uid,
        (next) => {
          setOrders(next);
          setState("ready");
        },
        (err) => {
          setErrorMessage(err.message);
          setState("error");
        },
      );
    });

    return () => {
      unsubAuth();
      unsubOrders?.();
    };
  }, []);

  if (state === "loading") {
    return (
      <p className="orders-list__status" role="status" aria-live="polite">
        Loading your orders…
      </p>
    );
  }

  if (state === "error") {
    return (
      <p className="orders-list__status orders-list__status--error" role="alert">
        Could not load orders: {errorMessage}
      </p>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <p>You have not placed any orders yet.</p>
        <Link href="/shop" className="orders-empty__cta">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <ul className="orders-list">
      {orders.map((order) => (
        <li key={order.id} className="orders-card">
          <header className="orders-card__header">
            <div>
              <p className="orders-card__date">{formatDate(order.createdAt)}</p>
              <p className="orders-card__id">Order #{order.id.slice(0, 8)}</p>
            </div>
            <div className="orders-card__meta">
              <span
                className={`orders-card__status orders-card__status--${order.status}`}
              >
                {STATUS_LABEL[order.status]}
              </span>
              <span className="orders-card__total">
                {formatCurrency(order.total, order.currency)}
              </span>
            </div>
          </header>

          {order.items.length > 0 ? (
            <ul className="orders-card__items">
              {order.items.map((item, idx) => (
                <li key={`${order.id}-${idx}`} className="orders-card__item">
                  <span className="orders-card__item-qty">
                    {item.quantity}×
                  </span>
                  <span className="orders-card__item-title">
                    {item.title}
                    {item.variantLabel && item.variantLabel !== "Standard" ? (
                      <span className="orders-card__item-variant">
                        {" "}
                        — {item.variantLabel}
                      </span>
                    ) : null}
                  </span>
                  <span className="orders-card__item-price">
                    {formatCurrency(item.price * item.quantity, order.currency)}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
