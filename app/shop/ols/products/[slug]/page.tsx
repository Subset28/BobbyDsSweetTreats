import { redirect } from "next/navigation";

import { getProductBySlug, getProductPath } from "@/lib/productCatalog";

export default async function LegacyProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    redirect("/shop");
  }

  redirect(getProductPath(product.slug));
}
