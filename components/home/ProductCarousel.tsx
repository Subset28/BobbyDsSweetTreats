"use client";

import Image from "next/image";
import { useState } from "react";

export type CarouselItem = { src: string; alt: string };

const VISIBLE = 3;

export function ProductCarousel({ items }: { items: CarouselItem[] }) {
  const [start, setStart] = useState(0);
  const last = Math.max(0, items.length - VISIBLE);

  function goTo(n: number) {
    setStart(Math.max(0, Math.min(last, n)));
  }

  return (
    <div className="bds-carousel">
      <div className="bds-carousel__main">
        {items.slice(start, start + VISIBLE).map((item, i) => (
          <div key={start + i} className="bds-carousel__slide">
            <Image
              src={item.src}
              alt={item.alt}
              width={400}
              height={500}
              className="bds-carousel__img"
              sizes="(max-width:640px) 90vw, (max-width:900px) 45vw, 32vw"
            />
          </div>
        ))}
      </div>
      <div className="bds-carousel__thumbs" role="list" aria-label="Product thumbnails">
        {items.map((item, i) => {
          const active = i >= start && i < start + VISIBLE;
          return (
            <button
              key={i}
              type="button"
              role="listitem"
              className={`bds-carousel__thumb${active ? " bds-carousel__thumb--active" : ""}`}
              onClick={() => goTo(Math.max(0, Math.min(last, i)))}
              aria-label={item.alt}
              aria-pressed={active}
            >
              <Image
                src={item.src}
                alt=""
                width={60}
                height={60}
                className="bds-carousel__thumb-img"
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
