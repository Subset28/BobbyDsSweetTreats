import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__copy">
          © {year} BobbieD&apos;s Sweet Treats. All Rights Reserved.
        </p>
        <nav className="site-footer__nav" aria-label="Footer">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-and-conditions">Terms and Conditions</Link>
        </nav>
      </div>
    </footer>
  );
}
