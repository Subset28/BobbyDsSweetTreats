type Props = { html: string; className?: string };

/** Full-width block wrapper; avoid `display: contents` (flex bugs in some engines). */
export function ScrapedHtml({ html, className }: Props) {
  const rootClass =
    className?.trim().length ?? 0
      ? `scraped-root ${className}`
      : "scraped-root";
  return (
    <div
      className={rootClass}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
