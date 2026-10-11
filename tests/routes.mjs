import assert from "node:assert/strict";
import { encodeSignatureHeader, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

const base = process.env.TEST_BASE_URL || "http://localhost:3010";
for (const route of ["/", "/about", "/projects", "/blog"]) {
  const response = await fetch(base + route);
  assert.equal(response.status, 200, route);
  assert.ok((await response.text()).includes('lang="tr"'));
}
assert.equal((await fetch(base + "/blog/does-not-exist")).status, 404);
for (const slug of ["nextjs-15-yenilikler", "full-stack-yol-haritasi"])
  assert.equal((await fetch(base + "/blog/" + slug)).status, 404);
const article = await fetch(base + "/blog/tailwind-css-v4-inceleme");
assert.equal(article.status, 200);
const markup = await article.text();
for (const text of [
  "Oxide Engine",
  "Nasıl ölçüldü?",
  "43× daha hızlı",
  "<table",
  "<pre",
  "heading-oxide-engine",
])
  assert.ok(
    markup.includes(text),
    `Missing published article content: ${text}`,
  );
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
  "Four pages, published article blocks, draft and unknown article 404s, and signed webhook validation passed.",
);
