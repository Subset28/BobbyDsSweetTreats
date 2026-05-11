import type { Metadata } from "next";

import { SiteShell } from "@/components/site/SiteShell";

export const metadata: Metadata = {
  title: "Terms and Conditions | BobbieD's Sweet Treats",
  description: "BobbieD's Sweet Treats terms, conditions, and refund policy.",
};

export default function TermsAndConditionsPage() {
  return (
    <SiteShell>
      <article className="site-legal">
        <h1>Terms and Conditions</h1>
        <p>
          Your Terms and Conditions section is like a contract between you and
          your customers. You make information and services available to your
          customers, and your customers must follow your rules.
        </p>
        <p>Common items in a terms and conditions agreement allow you to:</p>
        <ul>
          <li>
            Withdraw and cancel services, and make financial transactions.
          </li>
          <li>
            Manage customer expectations, such as liability for information
            errors or website downtime.
          </li>
          <li>
            Explain your copyright rules, such as attribution, adaptation,
            commercial or non-commercial use, etc.
          </li>
          <li>
            Set rules for user behavior, like forbidding unlawful behavior, hate
            speech, bullying, promotions, spam, etc.
          </li>
          <li>Disable user accounts.</li>
          <li>
            Write down any other terms or conditions that protect you or your
            audience.
          </li>
        </ul>

        <h2>Return and Refund Policy</h2>
        <p>
          This is a place to describe your Return and Refund Policy to buyers.
        </p>
        <p>A Return and Refund policy usually consists of:</p>
        <ul>
          <li>Terms of return (i.e. number of days)</li>
          <li>State of return (e.g. unworn)</li>
          <li>Reason for return (e.g. damaged or wrong product)</li>
          <li>
            Process for return (i.e. how to initiate a return, how to contact
            customer service)
          </li>
          <li>
            Process of refund (i.e. terms of refund, duration, payment details)
          </li>
          <li>Contact details</li>
        </ul>
      </article>
    </SiteShell>
  );
}
