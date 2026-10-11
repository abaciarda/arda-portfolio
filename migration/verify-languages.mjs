import assert from "node:assert/strict";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "w78zoc2a",
  dataset: "production",
  apiVersion: "2026-02-01",
  useCdn: false,
  perspective: "published",
});
const summary = [];
for (const locale of ["en", "tr"]) {
  const result = await client.fetch(
    ' { "projects": count(*[_type == "project" && locale == $locale]), "posts": *[_type == "post" && locale == $locale]{_id, "authorLocale": author->locale, "blocks": count(body)}, "profile": count(*[_type == "profile" && locale == $locale]), "settings": count(*[_type == "siteSettings" && locale == $locale]) } ',
    { locale },
  );
  assert.equal(result.projects, 7);
  assert.equal(result.profile, 1);
  assert.equal(result.settings, 1);
  assert.ok(
    result.posts.every(
      (post) => post.authorLocale === locale && post.blocks > 0,
    ),
  );
  assert.ok(result.posts.some((post) => post.blocks === 29));
  summary.push({
    locale,
    projects: result.projects,
    publishedPosts: result.posts.length,
    authorReferences: "valid",
  });
}
const metadata = await client.fetch(
  '*[_type == "translation.metadata"]{translations[]{language, "locale": value->locale}}',
);
assert.equal(metadata.length, 10);
assert.ok(
  metadata.every((item) =>
    item.translations.every(
      (translation) =>
        !translation.locale || translation.language === translation.locale,
    ),
  ),
);
console.log(
  JSON.stringify(
    { languages: summary, translationLinks: metadata.length },
    null,
    2,
  ),
);
