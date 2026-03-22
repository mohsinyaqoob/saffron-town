// src/sanity/schemaTypes/post.ts

import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const CATEGORY_OPTIONS = [
  { title: "Health & wellness", value: "health" },
  { title: "Recipes", value: "recipes" },
  { title: "Buying guide", value: "buying-guide" },
  { title: "About saffron", value: "about-saffron" },
];

export const postType = defineType({
  name: "post",
  title: "Blog post",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
    { name: "structured", title: "Structured Data" },
  ],
  fields: [
    // CONTENT FIELDS
    defineField({
      name: "title",
      title: "Title (H1)",
      type: "string",
      group: "content",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published date",
      type: "datetime",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body content",
      type: "array",
      group: "content",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt text",
              description: "Describe the image for accessibility and SEO",
              validation: (rule) => rule.required(),
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
        },
      ],
    }),

    // SEO FIELDS (required for every post)
    defineField({
      name: "seoTitle",
      title: "SEO title (50–60 chars)",
      type: "string",
      group: "seo",
      validation: (rule) => rule.required().min(40).max(65),
    }),
    defineField({
      name: "seoDescription",
      title: "Meta description (140–160 chars)",
      type: "string",
      group: "seo",
      validation: (rule) => rule.required().min(120).max(165),
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL (leave blank to auto-generate)",
      type: "url",
      group: "seo",
    }),
    defineField({
      name: "ogImage",
      title: "OG image (1200x630)",
      type: "image",
      group: "seo",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "noIndex",
      title: "Hide from Google (noindex)",
      type: "boolean",
      group: "seo",
      initialValue: false,
    }),

    // STRUCTURED DATA FIELDS
    defineField({
      name: "faqItems",
      title: "FAQ items (for FAQ schema)",
      type: "array",
      group: "structured",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "question",
              type: "string",
              title: "Question",
              validation: (rule) => rule.required(),
            },
            {
              name: "answer",
              type: "text",
              title: "Answer",
              validation: (rule) => rule.required(),
            },
          ],
          preview: {
            select: { title: "question" },
            prepare({ title }) {
              return { title: title || "FAQ item" };
            },
          },
        },
      ],
    }),

    // CATEGORISATION
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "content",
      options: {
        list: CATEGORY_OPTIONS,
      },
    }),

    // FEATURED IMAGE
    defineField({
      name: "mainImage",
      title: "Featured image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt text (describe the image with keyword)",
          validation: (rule) => rule.required(),
        },
      ],
    }),

    // AUTHOR
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      group: "content",
      to: [{ type: "author" }],
    }),

    // Legacy: last updated for dateModified in schema
    defineField({
      name: "updatedAt",
      title: "Last updated",
      type: "datetime",
      group: "content",
      description: "Used for Article schema dateModified",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "seoDescription",
      media: "mainImage",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Untitled",
        subtitle: subtitle ? `${subtitle.slice(0, 60)}...` : "",
      };
    },
  },
});
