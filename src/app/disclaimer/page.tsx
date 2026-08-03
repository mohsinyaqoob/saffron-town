import type { Metadata } from "next";
import Link from "next/link";
import {
  Clause,
  ClauseCallout,
  ClauseList,
  LegalPageLayout,
} from "@/components/legal/LegalPageLayout";
import { SITE_CONFIG } from "@/lib/constants";
import { LEGAL_CONFIG } from "@/lib/legal";

export const dynamic = "force-static";

const PAGE_URL = `${SITE_CONFIG.url}/disclaimer`;

export const metadata: Metadata = {
  title: "Product & Health Disclaimer",
  description:
    "Saffron Town sells saffron as a food product. It is not a medicine and is not intended to diagnose, treat, cure or prevent any disease. Guidance on pregnancy, allergies, dosage and natural product variation.",
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Product & Health Disclaimer | Saffron Town",
    description:
      "Saffron is sold as a food product, not a medicine. Read before using saffron during pregnancy or with medication.",
    url: PAGE_URL,
    type: "website",
  },
};

export default function DisclaimerPage() {
  return (
    <LegalPageLayout
      title="Product & Health Disclaimer"
      slug="disclaimer"
      intro="We sell saffron as a food ingredient. Some of our articles discuss its traditional and culinary uses, including during pregnancy. This page explains the limits of that information — please read it before relying on anything you find on this site."
    >
      <Clause heading="Saffron is a food, not a medicine">
        <ClauseCallout>
          <strong>
            Our saffron is a food product. It is not a drug, supplement or
            medical treatment, and it is not intended to diagnose, treat, cure
            or prevent any disease, illness or condition.
          </strong>
        </ClauseCallout>
        <p>
          Nothing on this website — product pages, articles, recipes,
          testimonials, or references to traditional, Ayurvedic or cultural
          practices — constitutes medical, nutritional or professional advice,
          and none of it should be used as a substitute for consulting a
          qualified doctor.
        </p>
      </Clause>

      <Clause heading="If you are pregnant or breastfeeding">
        <p>
          Saffron has a long culinary tradition in Indian households, including
          during pregnancy. That tradition is cultural, not clinical. We make no
          claim about any effect of saffron on pregnancy, on a mother, or on a
          baby.
        </p>
        <ClauseCallout>
          <strong>
            Speak to your doctor or midwife before consuming saffron during
            pregnancy or while breastfeeding
          </strong>
          , particularly in quantities larger than normal culinary use.
        </ClauseCallout>
        <p>
          Any pregnancy-related content we publish is general cultural and
          culinary background. It is not tailored to you, your medical history
          or your pregnancy.
        </p>
      </Clause>

      <Clause heading="Consult a doctor first if any of these apply">
        <ClauseList
          items={[
            "You are pregnant, trying to conceive, or breastfeeding.",
            "You take prescription medication, including blood thinners, antidepressants or blood-pressure medicine.",
            "You have a known allergy to saffron, Crocus species, or related plants.",
            "You have a chronic medical condition, or an upcoming surgery.",
            "You are giving saffron to an infant or young child.",
          ]}
        />
      </Clause>

      <Clause heading="Use in normal culinary quantities">
        <p>
          Saffron is intended to be used in small culinary amounts — typically a
          few strands per preparation. It is not meant to be consumed in large
          doses. Excessive consumption of saffron can be harmful. Do not treat
          any quantity mentioned in a recipe or article as a recommended
          medicinal dose.
        </p>
      </Clause>

      <Clause heading="Allergens and storage">
        <p>
          Saffron may not be suitable for everyone. Stop using it and seek
          medical advice if you experience any adverse reaction. Store in a
          cool, dry, airtight container away from direct sunlight. Once you open
          a pack, correct storage is your responsibility, and we cannot be
          responsible for deterioration caused by exposure to heat, moisture,
          light or air.
        </p>
      </Clause>

      <Clause heading="Natural variation">
        <p>
          Saffron is hand-harvested and varies naturally in colour, aroma,
          strand length and strength between harvests and batches. Photographs
          on this site are illustrative. Such variation is inherent to an
          agricultural product and is not a defect — see our{" "}
          <Link href="/terms">Terms of Use</Link>.
        </p>
      </Clause>

      <Clause heading="Quality claims and lab reports">
        <p>
          We describe our saffron by its GI-tagged Pampore origin and Mongra
          grade. Retail packs are{" "}
          <strong>
            not sold with an individual lab report or certificate of analysis
          </strong>
          , and we do not claim that any individual retail pack has been
          separately tested. Independent ISO 3632 testing can be arranged
          through a third-party laboratory for bulk orders above{" "}
          {LEGAL_CONFIG.labTestMinimumKg} kg, on request and at the
          customer&apos;s cost. See{" "}
          <Link href="/lab-reports">Quality &amp; Testing</Link>.
        </p>
      </Clause>

      <Clause heading="Reviews and third-party content">
        <p>
          Customer reviews reflect individual experience and opinion, not a
          promise of results. Articles may cite external research for general
          interest; citing a study is not a claim that our product produces the
          outcome the study describes, and we are not responsible for
          third-party content we link to.
        </p>
      </Clause>

      <Clause heading="Questions">
        <p>
          Contact us at{" "}
          <a href={`mailto:${LEGAL_CONFIG.email}`}>{LEGAL_CONFIG.email}</a> or{" "}
          <a href={`tel:${LEGAL_CONFIG.phone}`}>{LEGAL_CONFIG.phone}</a>.
        </p>
      </Clause>
    </LegalPageLayout>
  );
}
