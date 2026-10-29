import React from "react";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import RichText, { headingId } from "../app/components/RichText";
import type { RichTextNode } from "../app/sanity/types";

const source = JSON.parse(
  readFileSync("migration/source/content.json", "utf8"),
);

test("migrated article renders all its custom blocks without losing content", () => {
  const markup = renderToStaticMarkup(
    <RichText value={source.posts[0].body} />,
  );
  for (const text of [
    "Oxide Engine",
    "Nasıl ölçüldü?",
    "43× daha hızlı",
    "field-sizing-content",
    "CSS @theme direktifi",
    "npx @tailwindcss/upgrade@next",
  ])
    assert.ok(markup.includes(text), `Missing article content: ${text}`);
  assert.equal((markup.match(/<table/g) || []).length, 1);
  assert.equal((markup.match(/<pre/g) || []).length, 4);
  for (const block of source.posts[0].body.filter(
    (block: { _type: string; style?: string }) =>
      block._type === "block" && block.style === "h2",
  ))
    assert.ok(markup.includes(`id="${headingId(block)}"`));
});

test("inline badges and formatted notice text render inside rich text", () => {
  const value: RichTextNode[] = [
    {
      _type: "block",
      _key: "paragraph",
      style: "normal",
      markDefs: [],
      children: [
        { _type: "span", _key: "text", text: "Status: ", marks: [] },
        { _type: "badge", _key: "badge", label: "Ready", color: "green" },
      ],
    },
    {
      _type: "notice",
      _key: "notice",
      type: "warning",
      title: "Notice title",
      body: [
        {
          _type: "block",
          _key: "body",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "strong",
              text: "Important text",
              marks: ["strong"],
            },
          ],
        },
      ],
    },
  ];
  const markup = renderToStaticMarkup(<RichText value={value} />);
  assert.ok(markup.includes("Ready"));
  assert.ok(markup.includes("Notice title"));
  assert.match(markup, /<strong[^>]*>Important text<\/strong>/);
});

test("unsafe rich text links cannot become executable URLs", () => {
  const value: RichTextNode[] = [
    {
      _type: "block",
      _key: "link",
      style: "normal",
      markDefs: [
        { _type: "link", _key: "unsafe", href: "javascript:alert(1)" },
      ],
      children: [
        { _type: "span", _key: "text", text: "Link", marks: ["unsafe"] },
      ],
    },
  ];
  const markup = renderToStaticMarkup(<RichText value={value} />);
  assert.ok(markup.includes('href="#"'));
  assert.ok(!markup.includes("javascript:"));
});

test("migration retains unique keys, three projects, and valid author source content", () => {
  assert.equal(source.projects.length, 3);
  assert.equal(source.posts.length, 1);
  assert.equal(source.posts[0].body.length, 29);
  const keys = source.posts[0].body.map(
    (block: { _key: string }) => block._key,
  );
  assert.equal(new Set(keys).size, keys.length);
  assert.equal(
    source.profile.biography.length +
      source.profile.education.length +
      source.profile.focus.length,
    6,
  );
});
