import { ScrapedHtml } from "@/components/ScrapedHtml";
import { loadScrapedBody } from "@/lib/loadScrapedBody";

export default function Home({
  searchParams,
}: {
  searchParams?: {
    signup?: string;
  };
}) {
  const html = loadScrapedBody("home-body-inner.html");
  const needsEmailCheck = searchParams?.signup === "check-email";

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
