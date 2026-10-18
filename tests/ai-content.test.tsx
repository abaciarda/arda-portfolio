import assert from "node:assert/strict";
import test from "node:test";
import english from "../migration/source/content.en.json";
import turkish from "../migration/source/content.json";
import { llmsFull, llmsIndex, richTextMarkdown, type AiContent } from "../app/lib/ai-content";
import type { RichTextNode } from "../app/sanity/types";

const content = [english, turkish].map((source, index) => ({
  locale: index === 0 ? "en" : "tr",
  profile: { ...source.profile, avatar: "/assets/images/avatar.jpeg" },
  settings: source.settings,
  projects: source.projects.map((project) => ({ ...project, language: project.language.name })),
  posts: source.posts.map((post) => ({
    ...post, slug: post.slug.current, author: source.profile,
  })),
})) as unknown as AiContent[];

test("AI index includes canonical URLs in both languages and full-text discovery", () => {
  const index = llmsIndex(content);
  assert.ok(index.startsWith("# Arda Abacı\n\n> "));
  assert.ok(index.includes("https://ardaabaci.com/llms-full.txt"));
  assert.ok(index.includes("https://ardaabaci.com/tr/about"));
  assert.ok(!index.includes("https://ardaabaci.com/en"));
  for (const item of content) {
    for (const post of item.posts) assert.ok(index.includes(post.excerpt));
  }
});

test("full export preserves profile, projects, article code, comparisons, and custom content", () => {
  const full = llmsFull(content);
  for (const item of content) {
    assert.ok(full.includes(item.profile.summary));
    for (const project of item.projects) assert.ok(full.includes(project.description));
    for (const post of item.posts) {
      assert.ok(full.includes(post.publishedAt));
      assert.ok(full.includes(post.title));
    }
  }
  for (const text of ["Oxide Engine", "43× faster", "43× daha hızlı", "npx @tailwindcss/upgrade@next", "| --- |", "```", "Source: https://ardaabaci.com/tr/blog/"]) {
    assert.ok(full.includes(text), `Lost published content: ${text}`);
  }
});

test("Markdown preserves source links and nested notices without breaking code fences", () => {
  const blocks: RichTextNode[] = [
    { _type: "codeBlock", _key: "code", language: "md", code: "```js\nexample\n```" },
    { _type: "notice", _key: "note", title: "Details", body: [{
      _type: "block", _key: "paragraph", style: "normal",
      markDefs: [{ _key: "source", _type: "link", href: "/about" }],
      children: [{ _type: "span", _key: "s", text: "Author", marks: ["source"] }],
    }] },
  ];
  const markdown = richTextMarkdown(blocks);
  assert.ok(markdown.startsWith("````md\n```js"));
  assert.ok(markdown.includes("[Author](https://ardaabaci.com/about)"));
  assert.ok(markdown.includes("Details"));
});
