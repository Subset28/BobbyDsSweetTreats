export default function Loading() {
  return (
    <main className="bst-product-page" aria-busy="true">
      <div className="sr-only" role="status" aria-live="polite">
        Loading product…
      </div>
      <div className="bst-product-page__crumbs bst-product-page__crumbs--loading" />
      <section className="bst-product-page__shell">
        <div className="bst-product-page__media bst-product-page__media--loading" />
        <div className="bst-product-page__panel bst-product-page__panel--loading" />
      </section>
    </main>
  );
}
