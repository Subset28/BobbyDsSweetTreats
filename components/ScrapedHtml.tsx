import { ScrapedHtmlClient, type ScrapedHtmlProps } from "@/components/ScrapedHtmlClient";
import { SCRAPED_ROOT_ID } from "@/lib/scrapedHtmlRootId";

export type { ScrapedHtmlProps } from "@/components/ScrapedHtmlClient";

/**
 * Scraped storefront shell: HTML is emitted by the server (`dangerouslySetInnerHTML`) so the page
 * stays usable if the client enhancement bundle fails; `ScrapedHtmlClient` attaches listeners only.
 */
export function ScrapedHtml({ html, className, membershipForms }: ScrapedHtmlProps) {
  const rootClass =
    className?.trim().length ?? 0
      ? `scraped-root ${className}`
      : "scraped-root";

  return (
    <>
      <div
        id={SCRAPED_ROOT_ID}
        className={rootClass}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <ScrapedHtmlClient
        html={html}
        className={className}
        membershipForms={membershipForms}
      />
    </>
  );
}
