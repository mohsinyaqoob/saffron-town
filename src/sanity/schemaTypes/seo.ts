import { defineField, defineType } from "sanity";

export const seoType = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      description:
        "Override for search results (50–60 chars). Falls back to post title if empty.",
      type: "string",
      validation: (rule) =>
        rule.max(70).warning("Keep under 70 characters for best display"),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      description:
        "Summary for search results (150–160 chars). Falls back to excerpt if empty.",
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule.max(160).warning("Keep under 160 characters for best SEO"),
    }),
    defineField({
      name: "ogImage",
      title: "Social Share Image",
      description:
        "Override for Open Graph/Twitter (1200×630). Falls back to featured image if empty.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL",
      description:
        "Override canonical URL if different from default. Leave empty for auto.",
      type: "url",
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      description: "Add noindex to prevent indexing (e.g. drafts, duplicates)",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "keywords",
      title: "Keywords",
      description: "Target keywords for search (comma-separated or as tags)",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
  ],
});
