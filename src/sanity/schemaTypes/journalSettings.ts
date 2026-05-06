import { ControlsIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Single site-wide knobs for marketing + internal pillar links.
 * Editors pick Journal posts here — URLs are derived from slug at query time,
 * so new posts never require a code deploy.
 */
export const journalSettingsType = defineType({
  name: "journalSettings",
  title: "Journal settings",
  type: "document",
  icon: ControlsIcon,
  fields: [
    defineField({
      name: "pregnancyGuide",
      title: "Pregnancy / kesar guide",
      type: "reference",
      to: [{ type: "post" }],
      description:
        "Homepage pregnancy block & product SEO (“kesar for pregnancy”) link here.",
    }),
    defineField({
      name: "priceGuide",
      title: "Price guide",
      type: "reference",
      to: [{ type: "post" }],
      description: "Used in ai.txt / llms.txt “buyer guide” bullets when set.",
    }),
    defineField({
      name: "fakeSaffronGuide",
      title: "Real vs fake / identify saffron",
      type: "reference",
      to: [{ type: "post" }],
      description: "Used in ai.txt / llms.txt when set.",
    }),
    defineField({
      name: "pillarKashmiriVsIranian",
      title: "Pillar: Kashmiri vs Iranian (auto-linked in posts)",
      type: "reference",
      to: [{ type: "post" }],
      description:
        "Optional. If unset, the app resolves a published post with slug kashmiri-saffron-vs-iranian-saffron, else kashmiri-saffron-vs-iranian. Canonical path: /blog/{slug}.",
    }),
    defineField({
      name: "pillarMongraVsLacha",
      title: "Pillar: Mongra vs Lacha (auto-linked in posts)",
      type: "reference",
      to: [{ type: "post" }],
      description:
        "Optional. If unset, the app resolves slug mongra-vs-lacha-saffron when published. Canonical path: /blog/mongra-vs-lacha-saffron.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Journal settings" };
    },
  },
});
