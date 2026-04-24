import type { ReactNode } from "react";
import Link from "next/link";

type AuthShellProps = {
  badge: string;
  title: string;
  description: string;
  points: string[];
  footerPrompt: string;
  footerLinkHref: string;
  footerLinkLabel: string;
  children: ReactNode;
};

export function AuthShell({
  badge,
  title,
  description,
  points,
  footerPrompt,
  footerLinkHref,
  footerLinkLabel,
  children,
}: AuthShellProps) {
  return (
    <main className="auth-page">
      <div className="auth-page__orb auth-page__orb--left" aria-hidden="true" />
      <div className="auth-page__orb auth-page__orb--right" aria-hidden="true" />

      <section className="auth-page__shell">
        <aside className="auth-page__panel auth-page__panel--brand">
          <p className="auth-page__badge">{badge}</p>
          <h1 className="auth-page__title">{title}</h1>
          <p className="auth-page__description">{description}</p>

          <ul className="auth-page__points">
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </aside>

        <div className="auth-page__panel auth-page__panel--form">
          {children}

          <p className="auth-page__footer">
            {footerPrompt}{" "}
            <Link href={footerLinkHref}>{footerLinkLabel}</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
