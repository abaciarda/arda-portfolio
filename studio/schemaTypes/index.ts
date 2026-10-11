import { defineArrayMember, defineField, defineType } from "sanity";
import {
  DocumentTextIcon,
  UserIcon,
  CogIcon,
  CodeIcon,
  InfoOutlineIcon,
  ProjectsIcon,
  TagIcon,
  ImageIcon,
  ChartUpwardIcon,
  ThListIcon,
} from "@sanity/icons";

const localeField = defineField({
  name: "locale",
  title: "Content language",
  type: "string",
  options: {
    list: [
      { title: "English", value: "en" },
      { title: "Türkçe", value: "tr" },
    ],
    layout: "radio",
  },
  initialValue: "en",
  validation: (rule) =>
    rule
      .required()
      .custom(
        (value) =>
          value === "en" || value === "tr" || "Choose English or Turkish.",
      ),
});

const requiredString = (name: string, title?: string) =>
  defineField({
    name,
    title,
    type: "string",
    validation: (rule) => rule.required(),
  });
const colorField = defineField({
  name: "color",
  type: "string",
  options: { list: ["default", "blue", "green", "orange"] },
  initialValue: "default",
});
const imageField = (name: string, title?: string) =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alternative text",
        type: "string",
        validation: (rule) => rule.required(),
      }),
    ],
  });
const seoFields = [
  defineField({
    name: "seoTitle",
    title: "SEO title",
    type: "string",
    validation: (rule) => rule.max(70),
  }),
  defineField({
    name: "seoDescription",
    title: "SEO description",
    type: "text",
    rows: 3,
    validation: (rule) => rule.max(200),
  }),
];

const codeBlock = defineType({
  name: "codeBlock",
  title: "Code block",
  type: "object",
  icon: CodeIcon,
  fields: [
    requiredString("language"),
    defineField({
      name: "code",
      type: "text",
      rows: 12,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: "language", subtitle: "code" } },
});
const notice = defineType({
  name: "notice",
  title: "Notice",
  type: "object",
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: "type",
      title: "Notice type",
      type: "string",
      options: { list: ["tip", "info", "warning"] },
      initialValue: "info",
      validation: (rule) => rule.required(),
    }),
    requiredString("title"),
    defineField({
      name: "body",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: { select: { title: "title", subtitle: "type" } },
});
const badge = defineType({
  name: "badge",
  title: "Badge",
  type: "object",
  icon: TagIcon,
  fields: [requiredString("label"), colorField],
  preview: { select: { title: "label", subtitle: "color" } },
});
const comparisonTable = defineType({
  name: "comparisonTable",
  title: "Comparison table",
  type: "object",
  icon: ThListIcon,
  fields: [
    defineField({
      name: "columns",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(2).max(6),
    }),
    defineField({
      name: "rows",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "cells",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              validation: (rule) => rule.required().min(2).max(6),
            }),
          ],
          preview: { select: { title: "cells.0" } },
        }),
      ],
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .custom((rows, context) => {
            const columns = (context.parent as { columns?: string[] })?.columns;
            if (!rows || !columns) return true;
            return (
              rows.every(
                (row) =>
                  (row as { cells?: string[] }).cells?.length ===
                  columns.length,
              ) || "Every row must have one cell per column."
            );
          }),
    }),
  ],
  preview: { prepare: () => ({ title: "Comparison table" }) },
});
const benchmark = defineType({
  name: "benchmark",
  title: "Benchmark cards",
  type: "object",
  icon: ChartUpwardIcon,
  fields: [
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            requiredString("label"),
            requiredString("before"),
            requiredString("after"),
            requiredString("improvement"),
          ],
          preview: { select: { title: "label", subtitle: "improvement" } },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: { prepare: () => ({ title: "Benchmark cards" }) },
});
const featureList = defineType({
  name: "featureList",
  title: "Feature list",
  type: "object",
  icon: ThListIcon,
  fields: [
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            requiredString("title"),
            defineField({
              name: "description",
              type: "text",
              validation: (rule) => rule.required(),
            }),
            requiredString("badge"),
            colorField,
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: { prepare: () => ({ title: "Feature list" }) },
});
const articleImage = defineType({
  name: "articleImage",
  title: "Image",
  type: "image",
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    requiredString("alt", "Alternative text"),
    defineField({ name: "caption", type: "string" }),
  ],
});
const richText = defineType({
  name: "richText",
  title: "Article body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading", value: "h2" },
        { title: "Subheading", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            fields: [
              defineField({
                name: "href",
                type: "url",
                validation: (rule) =>
                  rule.required().uri({
                    allowRelative: true,
                    scheme: ["http", "https", "mailto"],
                  }),
              }),
            ],
          },
        ],
      },
      of: [defineArrayMember({ type: "badge" })],
    }),
    ...[
      "codeBlock",
      "notice",
      "comparisonTable",
      "benchmark",
      "featureList",
      "badge",
      "articleImage",
    ].map((type) => defineArrayMember({ type })),
  ],
});
const post = defineType({
  name: "post",
  title: "Posts",
  type: "document",
  icon: DocumentTextIcon,
  initialValue: () => ({
    locale: "en",
    publishedAt: new Date().toISOString(),
    author: { _type: "reference", _ref: "profile-en" },
  }),
  fields: [
    localeField,
    requiredString("title"),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
        isUnique: async (slug, context) => {
          const id = context.document?._id.replace(/^drafts\./, "");
          return context
            .getClient({ apiVersion: "2026-02-01" })
            .fetch(
              '!defined(*[_type == "post" && coalesce(locale, "tr") == $locale && slug.current == $slug && !(_id in [$id, "drafts." + $id])][0]._id)',
              { slug, locale: context.document?.locale || "en", id },
            );
        },
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    imageField("coverImage", "Cover image"),
    defineField({
      name: "publishedAt",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    requiredString("category"),
    defineField({
      name: "tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "author",
      type: "reference",
      to: [{ type: "profile" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      type: "richText",
      validation: (rule) => rule.required().min(1),
    }),
    ...seoFields,
  ],
  orderings: [
    {
      title: "Newest first",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "coverImage" },
  },
});
const project = defineType({
  name: "project",
  title: "Projects",
  type: "document",
  icon: ProjectsIcon,
  fields: [
    localeField,
    requiredString("title"),
    defineField({
      name: "href",
      title: "Project URL",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    requiredString("date", "Display date"),
    defineField({
      name: "description",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    imageField("image"),
    defineField({
      name: "repositoryImageUrl",
      title: "GitHub preview image URL",
      type: "url",
      validation: (rule) =>
        rule.uri({ scheme: ["https"] }).custom((value) => {
          if (!value) return true;
          try {
            return (
              new URL(value).hostname === "opengraph.githubassets.com" ||
              "Use a GitHub Open Graph image or upload an image above."
            );
          } catch {
            return "Enter a valid HTTPS URL.";
          }
        }),
    }),
    defineField({
      name: "commits",
      type: "number",
      initialValue: 0,
      validation: (rule) => rule.min(0).integer(),
    }),
    requiredString("language"),
    defineField({
      name: "order",
      type: "number",
      initialValue: 0,
      validation: (rule) => rule.required().integer(),
    }),
    defineField({
      name: "featured",
      title: "Show on homepage",
      type: "boolean",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "displayOrder",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: { select: { title: "title", subtitle: "language", media: "image" } },
});
const profile = defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  icon: UserIcon,
  fields: [
    localeField,
    requiredString("name"),
    requiredString("greeting"),
    requiredString("role"),
    imageField("avatar"),
    defineField({
      name: "summary",
      title: "Homepage biography",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "introduction",
      title: "About page introduction",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    ...["biography", "education", "focus"].map((name) =>
      defineField({
        name,
        type: "array",
        of: [defineArrayMember({ type: "block" })],
        validation: (rule) => rule.required().min(1),
      }),
    ),
    defineField({
      name: "skills",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
    ...["github", "linkedin", "instagram"].map((name) =>
      defineField({
        name,
        type: "url",
        validation: (rule) => rule.uri({ scheme: ["https"] }),
      }),
    ),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "avatar" } },
});
const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  fields: [
    localeField,
    requiredString("siteTitle"),
    defineField({
      name: "description",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "navigation",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            requiredString("label"),
            defineField({
              name: "href",
              type: "string",
              validation: (rule) =>
                rule
                  .required()
                  .custom(
                    (value) =>
                      !value ||
                      /^\/(?!\/)/.test(value) ||
                      "Use a local path starting with /",
                  ),
            }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    requiredString("projectsTitle"),
    defineField({ name: "projectsIntroduction", type: "text" }),
    requiredString("blogTitle"),
    defineField({ name: "blogIntroduction", type: "text" }),
  ],
  preview: { select: { title: "siteTitle" } },
});

export const schemaTypes = [
  post,
  project,
  profile,
  siteSettings,
  richText,
  codeBlock,
  notice,
  comparisonTable,
  benchmark,
  featureList,
  badge,
  articleImage,
];
