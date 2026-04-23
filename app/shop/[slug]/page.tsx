import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import {
  PRODUCT_CATALOG,
  getProductBySlug,
} from "@/lib/productCatalog";

export function generateStaticParams() {
  return PRODUCT_CATALOG.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="bst-product-page">
      <div className="bst-product-page__crumbs">
        <Link href="/shop">Shop</Link>
        <span aria-hidden="true">/</span>
        <span>{product.title}</span>
      </div>

      <section className="bst-product-page__shell">
        <div className="bst-product-page__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={product.alt} />
        </div>

        <div className="bst-product-page__panel">
          <ProductDetailClient product={product} />
        </div>
      </section>
    </main>
  );
}
