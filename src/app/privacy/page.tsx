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

/** Static page — built once at deploy */
export const dynamic = "force-static";

const PAGE_URL = `${SITE_CONFIG.url}/privacy`;
const OG_IMAGE = `${SITE_CONFIG.url}/products-grid.png`;

export const metadata: Metadata = {
  // Brand suffix is added by the title.template in app/layout.tsx — don't
  // append it here, or the rendered <title> ends up "… | Saffron Town | Saffron Town".
  title: "Privacy Policy",
  description:
    "How Saffron Town collects, uses, shares and protects your personal data — including payments, delivery, analytics and advertising tools — and the rights you have under India's DPDP Act, 2023.",
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Privacy Policy | Saffron Town",
    description:
      "How we collect, use, share and protect your data when you shop at Saffron Town.",
    url: PAGE_URL,
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Saffron Town privacy policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Saffron Town",
    description: "How we handle your data at Saffron Town.",
    images: [OG_IMAGE],
  },
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      slug="privacy"
      intro={`This policy explains what personal data ${SELLER_NAME} collects when you use ${SITE_CONFIG.url}, why we collect it, who we share it with, and the choices you have. We are the data fiduciary for that data under India's Digital Personal Data Protection Act, 2023.`}
    >
      <Clause heading="What we collect">
        <ClauseList
          items={[
            <>
              <strong>Order and contact details</strong> — name, email address,
              phone number, delivery address and PIN code, plus any note you add
              to an order.
            </>,
            <>
              <strong>Order history</strong> — what you bought, the amount paid,
              order status, and how you told us you heard about us.
            </>,
            <>
              <strong>Enquiries</strong> — anything you send us by form, email,
              phone or the chat widget, including bulk-order enquiries.
            </>,
            <>
              <strong>Technical data</strong> — IP address, browser and device
              type, pages viewed, and referring links.
            </>,
            <>
              <strong>Payment status</strong> — confirmation of whether a
              payment succeeded, and the gateway&apos;s reference IDs.
            </>,
          ]}
        />
        <ClauseCallout>
          <strong>We never see or store your full card details.</strong> Card,
          UPI and netbanking credentials are captured directly by our payment
          gateway on its own systems.
        </ClauseCallout>
      </Clause>

      <Clause heading="Why we use it">
        <ClauseList
          items={[
            "To process, pack, deliver and invoice your order, and to handle refunds or replacements.",
            "To send transactional messages — order confirmation, dispatch and tracking updates.",
            "To answer your questions and provide support.",
            "To check whether we can deliver to your PIN code.",
            "To detect and prevent fraud, abuse and payment disputes.",
            "To measure how our website and advertising perform, so we can improve both.",
            "To meet legal, tax and accounting obligations.",
          ]}
        />
      </Clause>

      <Clause heading="Who we share it with">
        <p>
          We do not sell your personal data. We share the minimum necessary with
          service providers who help us run the shop:
        </p>
        <ClauseList
          items={[
            <>
              <strong>Payment gateway (Razorpay)</strong> — to take payment and
              process refunds.
            </>,
            <>
              <strong>Courier partners</strong> — name, address and phone
              number, so your parcel can be delivered.
            </>,
            <>
              <strong>Email and messaging providers</strong> — to send order
              notifications.
            </>,
            <>
              <strong>Hosting, database and content providers</strong> — to run
              this website and store order records.
            </>,
            <>
              <strong>Analytics and advertising platforms</strong> — Google and
              Meta, as described below.
            </>,
            <>
              <strong>Chat support provider</strong> — if you start a chat with
              us on the site.
            </>,
          ]}
        />
        <p>
          We may also disclose data where required by law, court order or a
          lawful government request, or to establish or defend a legal claim.
        </p>
      </Clause>

      <Clause heading="Advertising and measurement">
        <p>
          We use Google Analytics and Google Ads to understand site traffic, and
          the Meta Pixel to measure the performance of our advertising on
          Facebook and Instagram. These tools set cookies and collect technical
          data about your visit.
        </p>
        <ClauseCallout>
          <strong>Sharing purchase data with Meta.</strong> When an order is
          paid, we send a server-side event to Meta&apos;s Conversions API so we
          can measure which adverts led to sales. That event includes your
          email, phone number, name and PIN code in{" "}
          <strong>irreversibly hashed (SHA-256) form</strong> — never as plain
          text — together with the order value and identifiers from Meta&apos;s
          own cookies. Meta uses these hashes to match the purchase to an
          account where one exists, and processes the data under its own terms.
        </ClauseCallout>
        <p>
          You can limit this by blocking cookies in your browser, using your
          device&apos;s tracking controls, or adjusting your ad preferences
          within Facebook, Instagram and Google. Blocking these tools does not
          affect your ability to place an order.
        </p>
      </Clause>

      <Clause heading="Cookies">
        <p>
          Cookies are small files stored by your browser. We use them to keep
          the site working (for example, remembering your checkout selection),
          to measure traffic, and for advertising measurement. You can delete or
          block cookies in your browser settings; essential cookies are required
          for checkout to function.
        </p>
      </Clause>

      <Clause heading="How long we keep it">
        <p>
          Order and invoice records are retained for as long as required by
          Indian tax and accounting law. Enquiries and chat transcripts are kept
          only as long as needed to deal with the matter and for a reasonable
          period afterwards. Technical and analytics data is retained according
          to the retention settings of the relevant platform.
        </p>
      </Clause>

      <Clause heading="Your rights">
        <p>Under the DPDP Act, 2023 you may ask us to:</p>
        <ClauseList
          items={[
            "Confirm what personal data of yours we hold, and give you access to it.",
            "Correct or complete inaccurate or outdated data.",
            "Erase data we no longer need for the purpose it was collected, subject to our legal retention duties.",
            "Withdraw consent for non-essential uses such as marketing.",
            "Nominate another person to exercise these rights on your behalf.",
          ]}
        />
        <p>
          Email{" "}
          <a href={`mailto:${LEGAL_CONFIG.email}`}>{LEGAL_CONFIG.email}</a> and
          we will respond within a reasonable period. We may need to verify your
          identity before acting.
        </p>
      </Clause>

      <Clause heading="Marketing messages">
        <p>
          If you opt in, we may send occasional messages about new harvests and
          offers. You can opt out at any time using the unsubscribe link or by
          replying to ask us to stop. Transactional messages about an order you
          have placed are not marketing and will continue.
        </p>
      </Clause>

      <Clause heading="Children">
        <p>
          This site is not directed at children, and we do not knowingly collect
          personal data from anyone under 18. If you believe a child has given
          us data, contact us and we will delete it.
        </p>
      </Clause>

      <Clause heading="Security">
        <p>
          We use reasonable technical and organisational safeguards, including
          encrypted connections (HTTPS), access controls on our order database,
          and payment handling by a PCI-compliant gateway. No method of
          transmission or storage is completely secure, and we cannot guarantee
          absolute security.
        </p>
      </Clause>

      <Clause heading="Changes to this policy">
        <p>
          We may update this policy as our practices or the law change. The
          current version is always published here, and was last updated on{" "}
          {LEGAL_CONFIG.lastUpdated}.
        </p>
      </Clause>

      <Clause heading="Contact and grievances">
        <p>
          For any privacy question or complaint, email{" "}
          <a href={`mailto:${LEGAL_CONFIG.email}`}>{LEGAL_CONFIG.email}</a> or
          call <a href={`tel:${LEGAL_CONFIG.phone}`}>{LEGAL_CONFIG.phone}</a>.
          {LEGAL_CONFIG.grievanceOfficer ? (
            <> Our Grievance Officer is {LEGAL_CONFIG.grievanceOfficer}.</>
          ) : null}{" "}
          See also our <Link href="/terms">Terms of Use</Link>,{" "}
          <Link href="/returns">Returns Policy</Link> and{" "}
          <Link href="/shipping">Shipping Policy</Link>.
        </p>
      </Clause>
    </LegalPageLayout>
  );
}
