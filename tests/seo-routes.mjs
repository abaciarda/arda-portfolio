import assert from "node:assert/strict";

const base = process.env.TEST_BASE_URL || "http://localhost:3011";
const headers = { "user-agent": "Googlebot" };
for (const agent of ["OAI-SearchBot", "PerplexityBot", "Claude-SearchBot"]) {
  for (const file of ["/llms.txt", "/llms-full.txt"]) {
    const response = await fetch(base + file, { headers: { "user-agent": agent } });
    assert.equal(response.status, 200, `${agent}: ${file}`);
    assert.match(response.headers.get("content-type"), /text\/plain; charset=utf-8/i);
    const markdown = await response.text();
    assert.ok(markdown.startsWith("# Arda"));
    assert.ok(markdown.includes("https://ardaabaci.com/tr"));
    assert.ok(!markdown.includes("<!DOCTYPE html>"));
    if (file === "/llms.txt") assert.ok(markdown.includes("https://ardaabaci.com/llms-full.txt"));
    else assert.ok(markdown.includes("Source: https://ardaabaci.com/about"));
  }
}
const sitemapResponse = await fetch(`${base}/sitemap.xml`);
assert.equal(sitemapResponse.status, 200);
assert.match(sitemapResponse.headers.get("content-type"), /xml/);
const sitemap = await sitemapResponse.text();
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(new Set(urls).size, urls.length);
assert.ok(urls.length >= 8);
assert.ok(!urls.some((url) => new URL(url).pathname.startsWith("/en")));
const descriptions = new Map();
for (const url of urls) {
  const path = new URL(url).pathname;
  const response = await fetch(base + path, { headers, redirect: "manual" });
  assert.equal(response.status, 200, path);
  assert.match(response.headers.get("link"), /<\/llms.txt>; rel="describedby"/);
  const html = await response.text();
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)[1];
  assert.equal(new URL(canonical).href, url, `Canonical mismatch: ${path}`);
  assert.match(html, new RegExp(`lang="${path.startsWith("/tr") ? "tr" : "en"}"`));
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert.ok(title?.includes("Arda"), `Missing branded title: ${path}`);
  assert.ok(!/^Home \|/.test(title), "Homepage title should identify the developer");
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  assert.ok(description, `Missing description: ${path}`);
  descriptions.set(path, description);
  assert.ok(!html.includes('content="noindex'), `Unexpected noindex: ${path}`);
  const ogUrl = html.match(/<meta property="og:url" content="([^"]+)"/)?.[1];
  assert.equal(new URL(ogUrl).href, url, `Social URL mismatch: ${path}`);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, path);
  if (!/\/blog\/.+/.test(path)) {
    const head = html.slice(0, html.indexOf("</head>"));
    const splash = [...head.matchAll(/<link\b[^>]*>/g)].map((match) => match[0])
      .filter((tag) => tag.includes('href="/assets/images/splash-bg.webp"'));
    assert.equal(splash.length, 1, `Missing or duplicate hero preload: ${path}`);
    assert.match(splash[0], /rel="preload"/);
    assert.match(splash[0], /as="image"/);
    assert.match(splash[0], /fetchPriority="high"/i);
  }
  for (const svg of html.matchAll(/<svg\b[^>]*>/g)) {
    assert.match(svg[0], /aria-hidden="true"/, `Unlabelled decorative icon: ${path}`);
    assert.match(svg[0], /focusable="false"/, `Focusable decorative icon: ${path}`);
  }
  assert.ok(!/<script[^>]+src="https:\/\/www.googletagmanager.com/.test(html), `Analytics downloaded during initial HTML parsing: ${path}`);
  const graphs = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)]
    .flatMap((match) => { const data = JSON.parse(match[1]); return data["@graph"] || [data]; });
  assert.ok(graphs.some((item) => item["@type"] === "Person"));
  assert.ok(graphs.some((item) => item["@type"] === "WebSite"));
  if (/\/blog\/.+/.test(path)) {
    const article = graphs.find((item) => item["@type"] === "BlogPosting");
    assert.ok(article?.headline);
    assert.ok(article?.datePublished);
    assert.equal(article.mainEntityOfPage, url);
    assert.ok(graphs.some((item) => item["@type"] === "BreadcrumbList"));
  }
}
for (const prefix of ["", "/tr"]) {
  assert.equal(new Set(["/", "/about", "/projects", "/blog"].map((path) => descriptions.get(prefix + (path === "/" ? "" : path) || "/"))).size, 4);
}
const robots = await fetch(`${base}/robots.txt`);
assert.equal(robots.status, 200);
assert.match(await robots.text(), /Sitemap: https:\/\/ardaabaci\.com\/sitemap\.xml/);
assert.equal((await fetch(`${base}/tr/blog/does-not-exist`, { headers })).status, 404);
assert.equal((await fetch(`${base}/blog/does-not-exist`, { headers })).status, 404);
const redirect = await fetch(`${base}/en/about`, { redirect: "manual" });
assert.equal(redirect.status, 308);
assert.equal(new URL(redirect.headers.get("location"), base).pathname, "/about");
console.log(`Checks passed for all ${urls.length} sitemap URLs, hero preloads, decorative icons, analytics, structured data, metadata, crawler rules, redirects, and missing articles.`);
