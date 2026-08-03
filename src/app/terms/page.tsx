import type { Metadata } from "next";
import Link from "next/link";
import {
  Clause,
  ClauseCallout,
  ClauseList,
  LegalPageLayout,
} from "@/components/legal/LegalPageLayout";
import { SITE_CONFIG } from "@/lib/constants";
import { LEGAL_CONFIG, SELLER_NAME } from "@/lib/legal";

export const dynamic = "force-static";

const PAGE_URL = `${SITE_CONFIG.url}/terms`;

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms governing your use of saffron.town and any order you place with Saffron Town — orders, pricing, delivery, product variation, liability and governing law.",
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Terms of Use | Saffron Town",
    description:
      "Terms governing your use of saffron.town and any order placed with us.",
    url: PAGE_URL,
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms of Use"
      slug="terms"
      intro={`These terms govern your use of ${SITE_CONFIG.url} and any order you place with us. By browsing this website or placing an order, you accept them. Please read them together with our Privacy Policy, Returns Policy, Shipping Policy and Product Disclaimer.`}
    >
      <Clause heading="Who you are dealing with">
        <p>
          This website is operated by {SELLER_NAME} (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;, &ldquo;our&rdquo;), selling Kashmiri saffron in
          India.
        </p>
        <ClauseList
          items={[
            LEGAL_CONFIG.registeredAddress ? (
              <>
                <strong>Registered address:</strong>{" "}
                {LEGAL_CONFIG.registeredAddress}
              </>
            ) : null,
            LEGAL_CONFIG.fssaiLicence ? (
              <>
                <strong>FSSAI licence:</strong> {LEGAL_CONFIG.fssaiLicence}
              </>
            ) : null,
            LEGAL_CONFIG.gstin ? (
              <>
                <strong>GSTIN:</strong> {LEGAL_CONFIG.gstin}
              </>
            ) : null,
            <>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${LEGAL_CONFIG.email}`}>{LEGAL_CONFIG.email}</a>
            </>,
            <>
              <strong>Phone:</strong>{" "}
              <a href={`tel:${LEGAL_CONFIG.phone}`}>{LEGAL_CONFIG.phone}</a>
            </>,
          ].filter(Boolean)}
        />
      </Clause>

      <Clause heading="Eligibility">
        <p>
          You must be at least 18 years old and capable of entering a binding
          contract under the Indian Contract Act, 1872 to place an order. By
          ordering, you confirm that the details you provide are accurate and
          that the delivery address is one you are authorised to use.
        </p>
      </Clause>

      <Clause heading="Orders and acceptance">
        <p>
          Your order is an offer to buy. A contract is formed only when we
          confirm dispatch. Until then we may decline or cancel any order — for
          example if stock has run out, if the delivery location is not
          serviceable, if a listing or price was published in error, or if we
          reasonably suspect fraud or resale in breach of these terms.
        </p>
        <p>
          If we cancel a paid order, we refund it in full. See our{" "}
          <Link href="/returns">Returns, Refunds &amp; Cancellations</Link>{" "}
          policy.
        </p>
      </Clause>

      <Clause heading="Pricing, taxes and payment">
        <ClauseList
          items={[
            "All prices are in Indian Rupees (INR) and include applicable taxes unless stated otherwise.",
            "Prices, offers and pack sizes may change at any time without notice. The price that applies is the one shown at the moment you complete payment.",
            "Payments are processed by our third-party payment gateway. We do not receive or store your full card details.",
            "In the event of an obvious pricing error, we may cancel the affected order and refund you in full rather than honour the incorrect price.",
          ]}
        />
      </Clause>

      <Clause heading="Natural product variation">
        <p>
          Saffron is a hand-harvested agricultural product. Colour, aroma,
          strand length and flavour intensity vary between harvests and even
          between batches from the same season. Photographs on this site are
          illustrative; the product you receive will not look pixel-identical to
          the images. Such variation is inherent to the product and is not a
          defect.
        </p>
      </Clause>

      <Clause heading="Quality claims and lab testing">
        <ClauseCallout>
          Retail packs are sold on the basis of GI-tagged Pampore origin and
          Mongra grade. They are{" "}
          <strong>
            not accompanied by an individual lab report or certificate of
            analysis
          </strong>
          , and we make no representation that any specific retail pack has been
          individually tested.
        </ClauseCallout>
        <p>
          Independent ISO 3632 testing may be arranged through a third-party
          laboratory for bulk orders above {LEGAL_CONFIG.labTestMinimumKg} kg,
          on the customer&apos;s written request and entirely at the
          customer&apos;s cost. Results are issued by the laboratory; we are not
          responsible for its turnaround time, methodology or findings. See{" "}
          <Link href="/lab-reports">Quality &amp; Testing</Link>.
        </p>
      </Clause>

      <Clause heading="No medical or health advice">
        <p>
          Saffron is sold as a food product. Nothing on this website — including
          articles, recipes, or references to traditional or cultural uses — is
          medical advice, and no product is offered to diagnose, treat, cure or
          prevent any disease or condition. Read our{" "}
          <Link href="/disclaimer">Product Disclaimer</Link> before using
          saffron during pregnancy or alongside medication.
        </p>
      </Clause>

      <Clause heading="Acceptable use">
        <ClauseList
          items={[
            "Do not use this site for any unlawful purpose, or to interfere with its operation or security.",
            "Do not scrape, mirror, resell or bulk-download our content, images or product data without written permission.",
            "Do not resell our products as your own brand, or repack them, without a written distribution agreement.",
            "Reviews and other submissions must be honest and your own; we may remove content that is false, abusive or infringing.",
          ]}
        />
      </Clause>

      <Clause heading="Intellectual property">
        <p>
          All content on this website — including text, photography, product
          descriptions, logos, and the {SITE_CONFIG.name} name — is owned by us
          or licensed to us and is protected by Indian and international
          intellectual property law. You may not copy or reuse it commercially
          without our written consent.
        </p>
      </Clause>

      <Clause heading="Third-party links and services">
        <p>
          This site links to and relies on third parties — payment gateways,
          couriers, analytics and advertising platforms, and external articles.
          We are not responsible for the content, availability or practices of
          third-party sites and services.
        </p>
      </Clause>

      <Clause heading="Limitation of liability">
        <p>
          To the fullest extent permitted by law, our total liability arising
          out of or in connection with any order is limited to the amount you
          paid for that order. We are not liable for indirect or consequential
          loss, including loss of profit, business or goodwill.
        </p>
        <p>
          Nothing in these terms excludes or limits liability that cannot be
          excluded under applicable law, including liability for death or
          personal injury caused by negligence, for fraud, or under the Consumer
          Protection Act, 2019.
        </p>
      </Clause>

      <Clause heading="Events outside our control">
        <p>
          We are not liable for delay or failure to perform caused by events
          beyond our reasonable control, including weather, crop failure,
          strikes, courier disruption, civil unrest, internet or power outages,
          government restrictions, or curfew and connectivity disruptions in the
          region we operate from.
        </p>
      </Clause>

      <Clause heading="Changes to these terms">
        <p>
          We may update these terms at any time. The version published here when
          you place an order is the version that applies to that order. This
          page was last updated on {LEGAL_CONFIG.lastUpdated}.
        </p>
      </Clause>

      <Clause heading="Governing law and jurisdiction">
        <p>
          These terms are governed by the laws of India. The courts at{" "}
          {LEGAL_CONFIG.jurisdictionCity}, {LEGAL_CONFIG.jurisdictionState} have
          exclusive jurisdiction, without prejudice to any consumer forum you
          are entitled to approach under the Consumer Protection Act, 2019.
        </p>
      </Clause>

      <Clause heading="Contact and grievances">
        <p>
          Email{" "}
          <a href={`mailto:${LEGAL_CONFIG.email}`}>{LEGAL_CONFIG.email}</a> or
          call <a href={`tel:${LEGAL_CONFIG.phone}`}>{LEGAL_CONFIG.phone}</a>.
          We aim to acknowledge complaints within 48 hours and resolve them
          within one month.
          {LEGAL_CONFIG.grievanceOfficer ? (
            <> Our Grievance Officer is {LEGAL_CONFIG.grievanceOfficer}.</>
          ) : null}
        </p>
      </Clause>
    </LegalPageLayout>
  );
}
