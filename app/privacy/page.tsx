import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "../_components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | MolaPlus Africa",
  description: "How MolaPlus Africa collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        MolaPlus Africa respects your privacy. Any personal information you share with us — such as your name, phone
        number, email address, or farm details submitted through our contact and consultation forms — is used solely to
        respond to your inquiries, process orders, and provide agronomic support.
      </p>
      <p>
        We do not sell or share your personal information with third parties, except where required to fulfil a
        delivery or comply with the law. Payment through M-Pesa (Till No: 906520) is processed by Safaricom and subject
        to their terms.
      </p>
      <p>
        For questions about your data, or to request correction or deletion, contact us at{" "}
        <a className="font-bold text-primary underline" href="mailto:info@molaplusafrica.com">
          info@molaplusafrica.com
        </a>{" "}
        or call{" "}
        <a className="font-bold text-primary underline" href="tel:+254724968847">
          +254 724 968 847
        </a>
        .
      </p>
      <p>
        See also our <Link className="font-bold text-primary underline" href="/terms">Terms of Service</Link>.
      </p>
    </LegalPage>
  );
}
