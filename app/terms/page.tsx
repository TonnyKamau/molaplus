import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "../_components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service | MolaPlus Africa",
  description: "Terms governing the use of MolaPlus Africa products, services, and website.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <p>
        By using this website and purchasing MolaPlus Africa products, you agree to these terms. Product information,
        feeding guides, and laboratory data are provided for guidance; results vary with animal health, feed quality,
        and farm management practices.
      </p>
      <p>
        Products should be stored and applied as directed on their labels. For tailored feeding programs, consult our
        technical team through the <Link className="font-bold text-primary underline" href="/consultancy">consultancy service</Link>{" "}
        before large-scale application.
      </p>
      <p>
        Orders paid via M-Pesa (Till No: 906520) are confirmed by our sales team, who will arrange logistics. Delivery
        timelines depend on your location and the nearest{" "}
        <Link className="font-bold text-primary underline" href="/outlets">distribution outlet</Link>.
      </p>
      <p>
        See also our <Link className="font-bold text-primary underline" href="/privacy">Privacy Policy</Link>. For any
        questions, contact{" "}
        <a className="font-bold text-primary underline" href="mailto:info@molaplusafrica.com">
          info@molaplusafrica.com
        </a>
        .
      </p>
    </LegalPage>
  );
}
