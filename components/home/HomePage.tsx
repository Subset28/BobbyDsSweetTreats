import Image from "next/image";
import Link from "next/link";

import { getProductPathByText } from "@/lib/productCatalog";
import { SHOP_PRODUCTS } from "@/lib/shopProducts";
import { HOME_HERO_IMAGE_URL } from "@/lib/siteBranding";
import { ProductCarousel } from "./ProductCarousel";
import type { CarouselItem } from "./ProductCarousel";

const CAROUSEL_ITEMS: CarouselItem[] = SHOP_PRODUCTS.map((p) => ({
  src: p.imageSrc,
  alt: p.title,
}));

const WI = (p: string) =>
  `https://img1.wsimg.com/isteam/ip/60198da3-e16c-45af-9193-df0c03c69433/${p}`;

type MenuItem = {
  title: string;
  description?: string;
  price: string;
  unit?: string;
  image?: string;
  imageAlt?: string;
};

type MenuCategory = {
  title: string;
  intro: string;
  items: MenuItem[];
};

const MENU: MenuCategory[] = [
  {
    title: "Chocolate covered fruit",
    intro: "Enjoy a large variety of our custom made chocolate dipped fruits!",
    items: [
      {
        title: "Strawberries",
        description: "Enjoy our chocolate covered strawberries",
        price: "$3 / $17.50 / $35",
        unit: "Order One / Six / Dozen",
        image: WI("Strawberry%203-0ddcf1c.jpg"),
        imageAlt: "Chocolate covered strawberries",
      },
    ],
  },
  {
    title: "Cake pops",
    intro: "Enjoy a large variety of our custom made cake pops!",
    items: [
      {
        title: "Chocolate hazelnut",
        price: "$3 / $16.50 / $33",
        unit: "Order One / Six / Dozen",
        image: WI("IMG_20260127_220351_(1)-a5612aa.jpg"),
        imageAlt: "Chocolate hazelnut cake pops",
      },
      {
        title: "Chocolate Crunch",
        price: "$3 / $16.50 / $33",
        unit: "Order One / Six / Dozen",
        image: WI("Chocolate%20crunch%20cake%20pop-65a7af0.jpg"),
        imageAlt: "Chocolate crunch cake pops",
      },
      {
        title: "Strawberry Crunch",
        price: "$3 / $16.50 / $33",
        unit: "Order One / Six / Dozen",
        image: WI("Strawberry-Shortcake-1-128c58b.jpg"),
        imageAlt: "Strawberry crunch cake pops",
      },
      {
        title: "Confetti Cake",
        price: "$3 / $16.50 / $33",
        unit: "Order One / Six / Dozen",
        image: WI("Confetti-9f1643d.jpg"),
        imageAlt: "Confetti cake pops",
      },
      {
        title: "Vanilla",
        price: "$3 / $16.50 / $33",
        unit: "Order One / Six / Dozen",
        image: WI("Vanilla-e33e171.jpg"),
        imageAlt: "Vanilla cake pops",
      },
    ],
  },
  {
    title: "Cookies \u00b7 Brownies \u00b7 Pretzels",
    intro: "Enjoy a large variety of our custom made dipped cookies!",
    items: [
      {
        title: "Chocolate Dipped Brownies",
        price: "$4 / $21 / $42",
        unit: "Order One / Six / Dozen",
        image: WI("IMG_20260127_220352-11ae0be.png"),
        imageAlt: "Chocolate dipped brownies",
      },
      {
        title: "Chocolate Dipped Cookies",
        price: "$3 / $16.50 / $30",
        unit: "Order One / Six / Dozen",
        image: WI("chocolate_covered_oreos_recipe-a8ca351.jpg"),
        imageAlt: "Chocolate dipped cookies",
      },
      {
        title: "Chocolate Dipped Pretzels",
        price: "$2 / $12 / $24",
        unit: "Order One / Six / Dozen",
        image: WI("Pretzel%202-51ae0c4.jpg"),
        imageAlt: "Chocolate dipped pretzels",
      },
      {
        title: "Chocolate Bark",
        description:
          "Choice of white or milk chocolate with various toppings.",
        price: "$25",
        image: WI("Bark%202-5b08dd3.jpg"),
        imageAlt: "Chocolate bark",
      },
      {
        title: "Peanut Butter Balls",
        description: "A dozen chocolate covered peanut butter balls.",
        price: "$12",
        image: WI("IMG_20260207_195502.jpg"),
        imageAlt: "Chocolate covered peanut butter balls",
      },
    ],
  },
  {
    title: "Holiday items",
    intro:
      "Our sweet treats made for you or a loved one for a special holiday!",
    items: [
      {
        title: "Cake pops",
        description:
          "A wide variety of our special holiday themed cake pops of your choosing!",
        price: "$4 / $24 / $48",
        unit: "Order One / Six / Dozen",
        image: WI("Confetti-9f1643d.jpg"),
        imageAlt: "Holiday cake pops",
      },
      {
        title: "Brownies",
        description:
          "A wide variety of our special holiday themed cookies of your choosing!",
        price: "$4 / $21 / $42",
        unit: "Order One / Six / Dozen",
        image: WI("IMG_20260127_220352-11ae0be.png"),
        imageAlt: "Holiday brownies",
      },
      {
        title: "Chocolate covered strawberry Bouquet (12\u00a0/\u00a018)",
        description:
          "A wide variety of our special holiday themed chocolate covered strawberries of your choosing!",
        price: "$45 / $60",
        image: WI("IMG_20260205_201535_(6)-2b5f174.jpg"),
        imageAlt: "Chocolate covered strawberry bouquet",
      },
    ],
  },
];

export function HomePage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section
        className="site-home-hero site-home-hero--split"
        aria-labelledby="home-hero-title"
      >
        <figure className="site-home-hero__figure">
          <Image
            src={HOME_HERO_IMAGE_URL}
            alt="Assorted handmade sweet treats from BobbieD's Sweet Treats"
            width={512}
            height={512}
            className="site-home-hero__inset-img"
            priority
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </figure>
        <div className="site-home-hero__copy">
          <h1 id="home-hero-title">Delicious Confections Fresh Daily</h1>
          <p className="site-home-hero__lead">
            <span>
              &ldquo;From celebrations to craving&rsquo;s, Bobbie D&rsquo;s
              sweet treats has the perfect dessert for every moment!&rdquo;
            </span>
          </p>
          <Link href="/shop" className="site-home-hero__cta">
            ORDER NOW
          </Link>
        </div>
      </section>

      {/* ── Our Story ──────────────────────────────────────────── */}
      <section className="site-home-story" aria-labelledby="home-story-title">
        <h2 id="home-story-title" className="site-home-story__heading">
          Our Story
        </h2>
        <p className="site-home-story__body-text">
          At BobbieD&rsquo;s Sweet Treats, we believe in crafting delicious
          memories. Our Confections have been serving the community with love
          and passion since its inception.
        </p>
      </section>

      {/* ── Product Gallery ────────────────────────────────────── */}
      <section className="site-home-gallery" aria-label="Product gallery">
        <p className="site-home-gallery__heading">
          Delicious creations from BobbieD&rsquo;s Sweet Treats
        </p>
        <ProductCarousel items={CAROUSEL_ITEMS} />
      </section>

      {/* ── Menu / Price List ──────────────────────────────────── */}
      <section className="site-home-menu" aria-labelledby="home-menu-title">
        <h2 id="home-menu-title" className="site-home-menu__title">
          Menu / Price List
        </h2>

        {MENU.map((cat, catIdx) => (
          <div key={cat.title} className="site-home-menu__cat-block">
            <h3 className="site-home-menu__cat-title">{cat.title}</h3>
            <p className="site-home-menu__cat-intro">{cat.intro}</p>
            <div className="site-home-menu__items-grid">
              {cat.items.map((item) => (
                <div key={item.title} className="site-home-menu__item-card">
                  {item.image ? (
                    <div className="site-home-menu__item-img">
                      <Image
                        src={item.image}
                        alt={item.imageAlt ?? item.title}
                        width={300}
                        height={300}
                        sizes="(max-width:600px) 90vw, (max-width:1024px) 45vw, 22vw"
                      />
                    </div>
                  ) : null}
                  <div className="site-home-menu__item-info">
                    <h4 className="site-home-menu__item-title">{item.title}</h4>
                    {item.unit ? (
                      <p className="site-home-menu__item-unit">{item.unit}</p>
                    ) : null}
                    <p className="site-home-menu__item-price">{item.price}</p>
                    {item.description ? (
                      <p className="site-home-menu__item-desc">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
            {catIdx < MENU.length - 1 ? (
              <hr className="site-home-menu__divider" aria-hidden="true" />
            ) : null}
          </div>
        ))}
      </section>

      {/* ── Contact ────────────────────────────────────────────── */}
      <section className="site-home-contact" aria-labelledby="home-contact-title">
        <div className="site-home-contact__two-col">
          <div className="site-home-contact__info-col">
            <p
              className="bds-eyebrow"
              id="home-contact-title"
              role="heading"
              aria-level={2}
            >
              Contact Us
            </p>
            <p className="site-home-contact__desc">
              Contact us to set up custom orders not available through the
              store.
            </p>
            <div className="site-home-contact__details">
              <p className="site-home-contact__biz-name">
                BobbieD&rsquo;s Sweet Treats
              </p>
              <p>Fairfax, VA, USA</p>
              <p>
                <a href="tel:+17173310408">717-331-0408</a>
              </p>
              <p>
                <a href="mailto:bobbied.sweettreats@gmail.com">
                  bobbied.sweettreats@gmail.com
                </a>
              </p>
              <p>
                <a
                  href="https://www.google.com/maps?q=Fairfax+VA+USA"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get directions
                </a>
              </p>
            </div>
            <a href="#contact-form" className="site-home-hero__cta site-home-contact__drop-btn">
              Drop us a line!
            </a>
          </div>
          <div className="site-home-contact__map-col">
            <iframe
              src="https://maps.google.com/maps?q=Fairfax,+VA,+USA&output=embed&z=14"
              title="BobbieD's Sweet Treats — Fairfax, VA"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* ── Contact Form ───────────────────────────────────────── */}
      <section
        id="contact-form"
        className="site-home-contact-form"
        aria-labelledby="home-dropline-title"
      >
        <h2
          id="home-dropline-title"
          className="site-home-contact-form__title"
        >
          Drop us a line!
        </h2>
        <form
          className="site-home-contact-form__form"
          action="mailto:bobbied.sweettreats@gmail.com"
          method="post"
          encType="text/plain"
        >
          <label className="site-home-contact__field">
            <span>Name</span>
            <input type="text" name="name" autoComplete="name" required />
          </label>
          <label className="site-home-contact__field">
            <span>Email*</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
            />
          </label>
          <label className="site-home-contact__field">
            <span>Message</span>
            <textarea name="message" rows={4} required />
          </label>
          <button type="submit" className="site-home-hero__cta">
            Send
          </button>
        </form>
      </section>

      {/* ── Connect With Us ────────────────────────────────────── */}
      <section
        className="site-home-connect"
        aria-labelledby="home-connect-title"
      >
        <p
          className="bds-eyebrow"
          id="home-connect-title"
          role="heading"
          aria-level={2}
        >
          Connect With Us
        </p>
        <div className="site-home-connect__icons">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="site-home-connect__icon"
            aria-label="Instagram"
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
              focusable="false"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a
            href="https://www.pinterest.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="site-home-connect__icon"
            aria-label="Pinterest"
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.853 0 1.265.641 1.265 1.408 0 .858-.546 2.141-.828 3.329-.236.994.499 1.806 1.48 1.806 1.773 0 3.142-1.874 3.142-4.579 0-2.394-1.72-4.068-4.177-4.068-2.845 0-4.515 2.134-4.515 4.34 0 .859.331 1.781.744 2.282a.3.3 0 01.069.287l-.278 1.133c-.044.183-.146.222-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.966-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
            </svg>
          </a>
          <a
            href="https://www.tiktok.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="site-home-connect__icon"
            aria-label="TikTok"
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.95a8.28 8.28 0 004.84 1.55V7.05a4.85 4.85 0 01-1.07-.36z" />
            </svg>
          </a>
        </div>
      </section>

      {/* ── Featured Products ───────────────────────────────────── */}
      <section
        className="site-home-featured"
        aria-labelledby="home-featured-title"
      >
        <p
          className="bds-eyebrow"
          id="home-featured-title"
          role="heading"
          aria-level={2}
        >
          Featured Products
        </p>
        <ul className="site-home-featured__grid">
          {SHOP_PRODUCTS.map((product) => {
            const href = getProductPathByText(product.title) ?? "/shop";
            return (
              <li key={product.title}>
                <Link href={href} className="site-home-featured__card">
                  <div className="site-home-featured__card-img">
                    <Image
                      src={product.imageSrc}
                      alt={product.title}
                      width={300}
                      height={300}
                      sizes="(max-width:640px) 90vw, (max-width:1024px) 45vw, 22vw"
                    />
                  </div>
                  <p className="site-home-featured__card-name">
                    {product.title}
                  </p>
                  <p className="site-home-featured__card-price">
                    {product.price}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="site-home-featured__footer">
          <Link href="/shop" className="site-home-featured__view-all">
            View All Products &rsaquo;
          </Link>
        </div>
      </section>
    </>
  );
}
