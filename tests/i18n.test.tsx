import React from "react";
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import {
  defaultLocale,
  dictionaries,
  formatDate,
  isLocale,
  languageAlternates,
  localizedPath,
} from "../app/i18n/config";
import RichText from "../app/components/RichText";
import BlogCard from "../app/components/BlogCard";

test("English is default and supported locale paths stay consistent", () => {
  assert.equal(defaultLocale, "en");
  assert.equal(isLocale("en"), true);
  assert.equal(isLocale("tr"), true);
  assert.equal(isLocale("de"), false);
  assert.equal(localizedPath("en", "/"), "/");
  assert.equal(localizedPath("tr", "/en/about"), "/tr/about");
  assert.equal(localizedPath("en", "/tr/blog/article"), "/blog/article");
  assert.equal(localizedPath("en", "/en/about"), "/about");
  assert.deepEqual(languageAlternates("/tr/about"), {
    canonical: "/tr/about",
    languages: { en: "/about", tr: "/tr/about", "x-default": "/about" },
  });
  assert.deepEqual(
    Object.keys(dictionaries.en).sort(),
    Object.keys(dictionaries.tr).sort(),
  );
});

test("dates follow the selected language in the Istanbul time zone", () => {
  const date = "2026-03-28T09:00:00+03:00";
  assert.equal(formatDate(date, "en"), "March 28, 2026");
  assert.equal(formatDate(date, "tr"), "28 Mart 2026");
});

test("English article preserves all custom blocks and translates their contents", () => {
  const source = JSON.parse(
    readFileSync("migration/source/content.en.json", "utf8"),
  );
  const turkish = JSON.parse(
    readFileSync("migration/source/content.json", "utf8"),
  );
  const markup = renderToStaticMarkup(
    <RichText value={source.posts[0].body} />,
  );
  assert.deepEqual(
    source.posts[0].body.map((block: { _key: string; _type: string }) => [
      block._key,
      block._type,
    ]),
    turkish.posts[0].body.map((block: { _key: string; _type: string }) => [
      block._key,
      block._type,
    ]),
  );
  for (const text of [
    "Why v4?",
    "How was this measured?",
    "43× faster",
    "CSS @theme directive",
    "New utility",
    "Breaking changes",
    "Conclusion",
  ])
    assert.ok(markup.includes(text), `Missing translated content: ${text}`);
  assert.ok(!/[ğĞşŞıİçÇöÖüÜ]/.test(markup));
  assert.equal((markup.match(/<pre/g) || []).length, 4);
  assert.equal((markup.match(/<table/g) || []).length, 1);
});

test("blog cards use locale links and translated action text", () => {
  const props = {
    title: "Title",
    image: "/assets/images/repo-placeholder.webp",
    excerpt: "Excerpt",
    date: "Date",
    slug: "article",
  };
  const english = renderToStaticMarkup(<BlogCard {...props} locale="en" />);
  const turkish = renderToStaticMarkup(<BlogCard {...props} locale="tr" />);
  assert.ok(english.includes('href="/blog/article"'));
  assert.ok(english.includes("Read article"));
  assert.ok(turkish.includes('href="/tr/blog/article"'));
  assert.ok(turkish.includes("Yazıyı oku"));
});
