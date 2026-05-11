import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

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
    <div className="site-shell">
      <SiteHeader />
      <main className="site-main site-main--membership">
        <div className="membership-page membership-page--in-shell">
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
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
