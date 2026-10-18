import assert from "node:assert/strict";
import test from "node:test";
import { pageMetadata, postAlternates, serializeJsonLd } from "../app/lib/seo";
import robots from "../app/robots";
import english from "../migration/source/content.en.json";

test("localized pages have their own canonical, description, and matching social URLs", () => {
  const profile = { ...english.profile, avatar: "/assets/images/avatar.jpeg" };
  const metadata = pageMetadata({ locale: "tr", path: "/projects", title: "Projeler", description: "Arda'nın projeleri", profile, siteName: "Arda Abacı" });
  assert.equal(metadata.alternates?.canonical, "/tr/projects");
  assert.equal(metadata.alternates?.languages?.en, "/projects");
  assert.equal(metadata.description, "Arda'nın projeleri");
  assert.equal(metadata.openGraph?.url, "https://ardaabaci.com/tr/projects");
  assert.equal(metadata.openGraph?.title, "Projeler | Arda Abacı");
  const home = pageMetadata({ locale: "en", title: "Arda Abacı | Developer", description: "Portfolio", profile, siteName: "Arda Abacı", home: true });
  assert.deepEqual(home.title, { absolute: "Arda Abacı | Developer" });
});

test("article alternates support different translated slugs without inventing translations", () => {
  assert.deepEqual(postAlternates({ slug: "merhaba" }, "tr"), {
    canonical: "/tr/blog/merhaba", languages: { tr: "/tr/blog/merhaba" },
  });
  assert.deepEqual(postAlternates({ slug: "hello", translations: [{ locale: "tr", slug: "merhaba" }] }, "en").languages, {
    tr: "/tr/blog/merhaba", en: "/blog/hello", "x-default": "/blog/hello",
  });
});

test("CMS text cannot escape a JSON-LD script", () => {
  const data = { headline: "</script><script>alert('x')</script>" };
  const serialized = serializeJsonLd(data);
  assert.ok(!serialized.includes("<"));
  assert.deepEqual(JSON.parse(serialized), data);
});

test("search crawlers can discover the sitemap and public pages", () => {
  assert.deepEqual(robots(), {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: "https://ardaabaci.com/sitemap.xml",
  });
});
