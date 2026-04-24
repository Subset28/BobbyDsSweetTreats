import { ScrapedHtml } from "@/components/ScrapedHtml";
import { loadScrapedBody } from "@/lib/loadScrapedBody";

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{
    signup?: string;
  }>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const html = loadScrapedBody("home-body-inner.html");
  const needsEmailCheck = resolvedSearchParams.signup === "check-email";

  return (
    <>
      {needsEmailCheck ? (
        <div className="auth-notice" role="status" aria-live="polite">
          Check your email to finish creating your account. You can keep using
          the dashboard while you verify it.
        </div>
      ) : null}
      <ScrapedHtml html={html} />
    </>
  );
}
