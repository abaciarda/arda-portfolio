import assert from "node:assert/strict";
import { encodeSignatureHeader, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

const base = process.env.TEST_BASE_URL || "http://localhost:3010";
for (const route of [
  "/",
  "/about",
  "/projects",
  "/blog",
  "/blog/tailwind-css-v4-inceleme",
]) {
  const response = await fetch(base + (route === "/" ? "/en" : "/en" + route), {
    redirect: "manual",
    headers: { "accept-language": "tr-TR,tr;q=0.9" },
  });
  assert.equal(response.status, 308);
  assert.equal(new URL(response.headers.get("location"), base).pathname, route);
}
for (const locale of ["en", "tr"]) {
  for (const route of ["", "/about", "/projects", "/blog"]) {
    const prefix = locale === "en" ? "" : "/tr";
    const response = await fetch(base + (prefix + route || "/"), {
      redirect: "manual",
      headers: { "accept-language": "tr-TR,tr;q=0.9" },
    });
    assert.equal(response.status, 200);
    const markup = await response.text();
    assert.ok(markup.includes(`lang="${locale}"`));
    const path = prefix + route || "/";
    assert.ok(
      markup.includes(
        `href="https://ardaabaci.com${path === "/" ? "" : path}"`,
      ),
      `Missing canonical for ${path}`,
    );
    assert.ok(
      markup.includes(`hrefLang="${locale === "en" ? "tr" : "en"}"`) ||
        markup.includes(`hreflang="${locale === "en" ? "tr" : "en"}"`),
    );
    if (route === "/about")
      assert.ok(markup.includes(locale === "en" ? "Education" : "Eğitim"));
  }
  assert.equal(
    (
      await fetch(
        base + (locale === "en" ? "" : "/tr") + "/blog/does-not-exist",
      )
    ).status,
    404,
  );
  assert.equal(
    (
      await fetch(
        base + (locale === "en" ? "" : "/tr") + "/blog/full-stack-yol-haritasi",
      )
    ).status,
    404,
  );
  if (locale === "en" && process.env.TEST_LANG_IMPORT_PENDING === "true")
    continue;
  const article = await fetch(
    base + (locale === "en" ? "" : "/tr") + "/blog/tailwind-css-v4-inceleme",
  );
  assert.equal(article.status, 200);
  const markup = await article.text();
  for (const text of [
    "Oxide Engine",
    locale === "en" ? "How was this measured?" : "Nasıl ölçüldü?",
    locale === "en" ? "43× faster" : "43× daha hızlı",
    "<table",
    "<pre",
    "heading-oxide-engine",
  ])
    assert.ok(
      markup.includes(text),
      `Missing ${locale} article content: ${text}`,
    );
  if (process.env.TEST_LANG_IMPORT_PENDING !== "true") {
    assert.ok(
      markup.includes(
        `href="https://ardaabaci.com${locale === "en" ? "/tr" : ""}/blog/tailwind-css-v4-inceleme"`,
      ),
    );
  }
}
assert.equal((await fetch(base + "/de")).status, 404);
assert.equal((await fetch(base + "/en/nonexistent")).status, 404);
const endpoint = base + "/api/sanity/revalidate";
assert.equal(
  (await fetch(endpoint, { method: "POST", body: "{}" })).status,
  401,
);
assert.equal(
  (
    await fetch(endpoint, {
      method: "POST",
      body: "{}",
      headers: { [SIGNATURE_HEADER_NAME]: "invalid" },
    })
  ).status,
  401,
);
const body = JSON.stringify({ _id: "verification", _type: "post" });
const signature = await encodeSignatureHeader(
  body,
  Date.now(),
  "sanity-local-verification",
);
const valid = await fetch(endpoint, {
  method: "POST",
  body,
  headers: { [SIGNATURE_HEADER_NAME]: signature },
});
assert.equal(valid.status, 200);
assert.deepEqual(await valid.json(), { revalidated: true });
assert.equal(
  (
    await fetch(endpoint, {
      method: "POST",
      body: body + " ",
      headers: { [SIGNATURE_HEADER_NAME]: signature },
    })
  ).status,
  401,
);
console.log(
  "English and Turkish pages, default redirects, SEO metadata, article blocks, draft privacy, and webhook validation passed.",
);
