import type { ReactNode } from "react";

type MembershipShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

/** Storefront-style membership block (matches ACCOUNT / SSO layout). */
export function MembershipShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: MembershipShellProps) {
  return (
    <main className="membership-page">
      <div className="membership-page__backdrop" aria-hidden />
      <section
        className="membership-page__section"
        aria-labelledby="membership-shell-heading"
      >
        <div className="membership-page__container">
          <p className="membership-page__eyebrow">{eyebrow}</p>
          <h1 id="membership-shell-heading" className="membership-page__title">
            {title}
          </h1>
          <p className="membership-page__intro">{description}</p>
          <div className="membership-page__body">{children}</div>
          {footer ? (
            <div className="membership-page__links-row">{footer}</div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
