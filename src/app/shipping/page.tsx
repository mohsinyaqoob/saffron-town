import type { Metadata } from "next";
import Link from "next/link";
import {
  Clause,
  ClauseList,
  LegalPageLayout,
} from "@/components/legal/LegalPageLayout";
import { SITE_CONFIG } from "@/lib/constants";
import { LEGAL_CONFIG } from "@/lib/legal";

export const dynamic = "force-static";

const PAGE_URL = `${SITE_CONFIG.url}/shipping`;

export const metadata: Metadata = {
  title: "Shipping & Delivery",
  description:
    "How Saffron Town dispatches and delivers orders across India — processing times, delivery estimates, shipping charges, tracking, and what happens if a parcel is delayed or undelivered.",
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Shipping & Delivery | Saffron Town",
    description:
      "Processing times, delivery estimates, charges and tracking for Saffron Town orders.",
    url: PAGE_URL,
    type: "website",
  },
};

export default function ShippingPage() {
  return (
    <LegalPageLayout
      title="Shipping & Delivery"
      slug="shipping"
      intro="Every order is packed and dispatched from Kashmir. This page explains how long that takes, what it costs, and what happens when a delivery goes wrong."
    >
      <Clause heading="Where we deliver">
        <p>
          We deliver across India through reputed courier partners. Some PIN
          codes are not serviceable, or are serviceable only with longer transit
          times. You can check your PIN code at checkout before paying. We do
          not currently ship internationally.
        </p>
      </Clause>

      <Clause heading="Processing and dispatch">
        <p>
          Orders are usually packed and handed to the courier within{" "}
          <strong>1–2 working days</strong> of successful payment. Orders placed
          on Sundays, public holidays, or during local disruptions are processed
          on the next working day.
        </p>
      </Clause>

      <Clause heading="Delivery estimates">
        <ClauseList
          items={[
            <>
              <strong>Metros and major cities:</strong> typically 3–5 working
              days after dispatch.
            </>,
            <>
              <strong>Other locations:</strong> typically 5–8 working days after
              dispatch.
            </>,
            <>
              <strong>Remote, hill and restricted-access areas:</strong> may
              take longer.
            </>,
          ]}
        />
        <p>
          These are estimates from the courier, not guarantees. Once a parcel
          leaves our facility, transit time is controlled by the courier and can
          be affected by weather, road closures, strikes and other disruptions.
          Delivery timelines are not treated as a condition of the contract.
        </p>
      </Clause>

      <Clause heading="Shipping charges">
        <p>
          Delivery is <strong>free on orders above ₹499</strong>. Below that, a
          flat delivery charge is shown at checkout before you pay. The amount
          payable is always the total displayed on the checkout page.
        </p>
      </Clause>

      <Clause heading="Tracking your order">
        <p>
          We send order and dispatch updates to the email address and phone
          number given at checkout, including tracking details once the courier
          scans the parcel. Tracking can take up to 24 hours to become active.
          If you have not received an update, contact{" "}
          <a href={`mailto:${LEGAL_CONFIG.email}`}>{LEGAL_CONFIG.email}</a>.
        </p>
      </Clause>

      <Clause heading="Please check the parcel on arrival">
        <p>
          Inspect the outer packaging and the pack seal before accepting
          delivery where possible, and take an unboxing video. If the parcel is
          visibly damaged or tampered with, refuse delivery or photograph it
          immediately and tell us within {LEGAL_CONFIG.damageReportWindowHours}{" "}
          hours. This evidence is what allows us to file a courier claim and
          replace your order — see{" "}
          <Link href="/returns">Returns, Refunds &amp; Cancellations</Link>.
        </p>
      </Clause>

      <Clause heading="Incorrect addresses and failed delivery">
        <p>
          Please make sure your address, landmark, PIN code and phone number are
          complete and correct. Couriers typically attempt delivery two to three
          times. If a parcel is returned to us because the address was wrong or
          incomplete, because nobody was reachable, or because delivery was
          refused, we refund the order value less the actual shipping and
          return-shipping costs incurred.
        </p>
      </Clause>

      <Clause heading="Lost parcels">
        <p>
          If tracking stops updating or a parcel is confirmed lost by the
          courier, we will replace the order or refund it in full once the
          courier completes its investigation. We raise that claim on your
          behalf — you do not need to deal with the courier yourself.
        </p>
      </Clause>

      <Clause heading="Questions">
        <p>
          Email{" "}
          <a href={`mailto:${LEGAL_CONFIG.email}`}>{LEGAL_CONFIG.email}</a> or
          call <a href={`tel:${LEGAL_CONFIG.phone}`}>{LEGAL_CONFIG.phone}</a>{" "}
          with your order number and we will look into it.
        </p>
      </Clause>
    </LegalPageLayout>
  );
}
