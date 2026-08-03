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

const PAGE_URL = `${SITE_CONFIG.url}/returns`;

export const metadata: Metadata = {
  title: "Returns, Refunds & Cancellations",
  description:
    "Saffron is a sealed food product, so we do not accept returns or exchanges for change of mind. How we handle damaged, incorrect, missing or undelivered orders, and how cancellations and refunds work.",
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Returns, Refunds & Cancellations | Saffron Town",
    description:
      "No returns or exchanges on a sealed food product. How we handle damaged, incorrect or undelivered orders.",
    url: PAGE_URL,
    type: "website",
  },
};

export default function ReturnsPage() {
  return (
    <LegalPageLayout
      title="Returns, Refunds & Cancellations"
      slug="returns"
      intro={`This policy explains when an order can be cancelled, when a refund or replacement is available, and why saffron cannot be returned once it has been dispatched. It applies to every order placed on ${SITE_CONFIG.url}.`}
    >
      <Clause heading="No returns or exchanges">
        <ClauseCallout>
          <strong>We do not accept returns or exchanges.</strong> Saffron is a
          consumable food product sold in tamper-evident, sealed packaging. Once
          a pack has left our facility we cannot verify how it was stored,
          handled or whether it was opened, so we cannot resell it or take it
          back into stock.
        </ClauseCallout>
        <p>
          This means we do not accept returns, exchanges or refunds because you
          changed your mind, ordered the wrong pack size, no longer want the
          product, found it cheaper elsewhere, or did not like the aroma, colour
          or flavour. Saffron is a natural agricultural product and these
          characteristics vary between harvests — see our{" "}
          <Link href="/disclaimer">Product Disclaimer</Link>.
        </p>
        <p>
          Please choose your pack size carefully before paying. If you are
          unsure, start with the 1g pack.
        </p>
      </Clause>

      <Clause heading="What we do put right">
        <p>
          Refusing a return for change of mind is not the same as refusing
          responsibility for our own mistakes. We will replace or refund an
          order in the following cases:
        </p>
        <ClauseList
          items={[
            <>
              <strong>Damaged in transit</strong> — the pack or seal arrived
              broken, crushed or leaking.
            </>,
            <>
              <strong>Wrong item or pack size</strong> — you received something
              other than what your order confirmation shows.
            </>,
            <>
              <strong>Missing item</strong> — part of your order is absent from
              the parcel.
            </>,
            <>
              <strong>Not delivered</strong> — the parcel is lost in transit or
              is not delivered within a reasonable period.
            </>,
          ]}
        />
        <p>
          Nothing in this policy limits any right or remedy you have under the
          Consumer Protection Act, 2019 or other applicable Indian law.
        </p>
      </Clause>

      <Clause heading="How to raise a claim">
        <p>
          Report the problem within{" "}
          <strong>
            {LEGAL_CONFIG.damageReportWindowHours} hours of delivery
          </strong>{" "}
          by emailing{" "}
          <a href={`mailto:${LEGAL_CONFIG.email}`}>{LEGAL_CONFIG.email}</a> or
          messaging{" "}
          <a href={`tel:${LEGAL_CONFIG.phone}`}>{LEGAL_CONFIG.phone}</a> with:
        </p>
        <ClauseList
          items={[
            "Your order number.",
            "Clear photographs of the outer parcel, the shipping label and the sealed pack as received.",
            "For a damaged or wrong item, a photograph showing the issue.",
          ]}
        />
        <p>
          We strongly recommend recording an unboxing video. Without evidence
          that the pack arrived damaged or incorrect, a courier claim cannot be
          filed and we may be unable to approve a replacement.
        </p>
        <p>
          Once approved, we will send a replacement at our cost or refund you in
          full — your choice. We may ask you to return the item, in which case
          we arrange and pay for the pickup.
        </p>
      </Clause>

      <Clause heading="Cancelling an order">
        <p>
          You can cancel <strong>before dispatch</strong> for a full refund.
          Email or call us as soon as possible with your order number. We
          usually dispatch within one to two working days, so cancellation
          requests received after dispatch cannot be accepted.
        </p>
        <p>
          We may cancel an order ourselves — and refund you in full — if the
          item is out of stock, if the delivery address is not serviceable, if a
          pricing or listing error is discovered, or if we suspect fraudulent or
          abusive ordering.
        </p>
      </Clause>

      <Clause heading="Failed and refused deliveries">
        <p>
          If a parcel is returned to us because the address was incorrect or
          incomplete, because nobody was available across the courier's delivery
          attempts, or because delivery was refused, we will refund the order
          value{" "}
          <strong>less the actual shipping and return-shipping costs</strong>{" "}
          incurred. Repeated refusal of delivery may result in us declining
          future orders.
        </p>
      </Clause>

      <Clause heading="How refunds are paid">
        <p>
          Approved refunds are issued to the original payment method through our
          payment gateway. We initiate the refund within 2 working days of
          approval; it typically reaches your account within 5–7 working days,
          depending on your bank or card issuer. We cannot refund to a different
          account, and we do not offer cash refunds.
        </p>
      </Clause>

      <Clause heading="Lab reports and certificates of analysis">
        <ClauseCallout>
          <strong>
            Retail packs are not supplied with a lab report or certificate of
            analysis.
          </strong>{" "}
          The absence of a per-pack certificate is not a defect and is not a
          ground for a refund or return.
        </ClauseCallout>
        <p>
          We do not lab-test every retail batch. Our retail assurance is the
          GI-tagged Pampore origin and the Mongra grade of the saffron.
        </p>
        <p>
          Independent ISO 3632 testing can be arranged for{" "}
          <strong>
            bulk orders above {LEGAL_CONFIG.labTestMinimumKg} kg, on the
            customer's written request
          </strong>
          , through a third-party laboratory. The customer bears the full cost
          of the test and any associated shipping of samples, and the testing
          timeline is set by the laboratory, not by us. Where testing is agreed,
          it must be arranged before dispatch. Read more on our{" "}
          <Link href="/lab-reports">Quality &amp; Testing</Link> page.
        </p>
      </Clause>

      <Clause heading="Contact">
        <p>
          Questions about this policy? Email{" "}
          <a href={`mailto:${LEGAL_CONFIG.email}`}>{LEGAL_CONFIG.email}</a> or
          call <a href={`tel:${LEGAL_CONFIG.phone}`}>{LEGAL_CONFIG.phone}</a>.
          {LEGAL_CONFIG.grievanceOfficer ? (
            <>
              {" "}
              Unresolved complaints may be escalated to our Grievance Officer,{" "}
              {LEGAL_CONFIG.grievanceOfficer}.
            </>
          ) : null}{" "}
          Orders are sold by {SELLER_NAME}.
        </p>
      </Clause>
    </LegalPageLayout>
  );
}
