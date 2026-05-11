import { HomePage } from "@/components/home/HomePage";
import { SiteShell } from "@/components/site/SiteShell";

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{
    signup?: string;
  }>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const needsEmailCheck = resolvedSearchParams.signup === "check-email";

  return (
    <SiteShell>
      {needsEmailCheck ? (
        <div className="auth-notice" role="status" aria-live="polite">
          Check your email to finish creating your account. You can keep using
          the dashboard while you verify it.
        </div>
      ) : null}
      <HomePage />
    </SiteShell>
  );
}
