type Props = { html: string };

/** Full-width block wrapper; avoid `display: contents` (flex bugs in some engines). */
export function ScrapedHtml({ html }: Props) {
  return (
    <div
      className="scraped-root"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
