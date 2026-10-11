import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { createClient } from "@sanity/client";

const source = JSON.parse(
  await readFile(new URL("./source/content.json", import.meta.url), "utf8"),
);
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "w78zoc2a";
const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apply = process.argv.includes("--apply");
const plan = {
  projectId,
  dataset,
  profile: 1,
  settings: 1,
  projects: source.projects.length,
  publishedPosts: source.posts.length,
  draftPosts: 2,
  mode: apply ? "import missing documents" : "dry run",
  existingDocuments: "Preserved; no replacements or deletes",
};
console.log(JSON.stringify(plan, null, 2));
if (!apply) process.exit(0);
if (!process.env.SANITY_API_WRITE_TOKEN)
  throw new Error(
    "Set SANITY_API_WRITE_TOKEN in .env.local before importing. Use an Editor token and remove it after import.",
  );

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-02-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});
const uploaded = new Map();
async function upload(path, alt) {
  if (!uploaded.has(path)) {
    const file = await readFile(
      resolve(repositoryRoot, "public", path.replace(/^\//, "")),
    );
    const asset = await client.assets.upload("image", file, {
      filename: path.split("/").pop(),
    });
    uploaded.set(path, asset._id);
  }
  return {
    _type: "image",
    asset: { _type: "reference", _ref: uploaded.get(path) },
    alt,
  };
}
async function missing(id) {
  return !(await client.getDocument(id));
}
const results = [];
if (await missing("profile")) {
  await client.createIfNotExists({
    _id: "profile",
    ...source.profile,
    avatar: await upload("/assets/images/avatar.jpeg", source.profile.name),
  });
  results.push("profile");
}
if (await missing("siteSettings")) {
  await client.createIfNotExists({ _id: "siteSettings", ...source.settings });
  results.push("siteSettings");
}
for (const [order, item] of source.projects.entries()) {
  const id = `import-project-${createHash("sha256").update(item.title).digest("hex").slice(0, 20)}`;
  if (!(await missing(id))) continue;
  const { image, language, href, icon, ...fields } = item;
  void icon;
  const media = image.startsWith("/")
    ? { image: await upload(image, item.title) }
    : { repositoryImageUrl: image };
  await client.createIfNotExists({
    _id: id,
    _type: "project",
    ...fields,
    ...media,
    language: language.name,
    ...(href !== "#" ? { href } : {}),
    order,
    featured: true,
  });
  results.push(id);
}
for (const post of source.posts) {
  const id = `import-post-${post.slug.current}`;
  if (!(await missing(id))) continue;
  const { coverPath, ...fields } = post;
  await client.createIfNotExists({
    _id: id,
    ...fields,
    author: { _type: "reference", _ref: "profile" },
    coverImage: await upload(coverPath, post.title),
  });
  results.push(id);
}
const drafts = [
  {
    title: "Next.js 15 ile Gelen Yenilikler",
    slug: "nextjs-15-yenilikler",
    excerpt:
      "Yeni sürümle birlikte gelen App Router iyileştirmeleri, kısmi ön işleme ve React 19 desteği üzerine bir inceleme.",
    publishedAt: "2026-03-29T09:00:00+03:00",
    category: "Geliştirme",
    coverPath: "/assets/images/blog/nextjs-article.webp",
  },
  {
    title: "Full-Stack Geliştirici Yol Haritası",
    slug: "full-stack-yol-haritasi",
    excerpt:
      "2026 yılında bir full-stack geliştirici hangi teknolojilere odaklanmalı? Modern web ekosistemine dair ipuçları.",
    publishedAt: "2026-03-25T09:00:00+03:00",
    category: "Kariyer",
    coverPath: "/assets/images/blog/fullstack-article.png",
  },
];
for (const draft of drafts) {
  const publishedId = `import-post-${draft.slug}`;
  const id = `drafts.${publishedId}`;
  if (!(await missing(publishedId)) || !(await missing(id))) continue;
  const { coverPath, slug, ...fields } = draft;
  await client.createIfNotExists({
    _id: id,
    _type: "post",
    ...fields,
    slug: { _type: "slug", current: slug },
    author: { _type: "reference", _ref: "profile" },
    coverImage: await upload(coverPath, draft.title),
    tags: [],
    body: [],
  });
  results.push(id);
}
const documents = await client.fetch(
  '*[_type in ["post", "project", "profile", "siteSettings"]]{_id, _type, "slug": slug.current, "blocks": count(body), "authorExists": defined(author->._id), "imageExists": defined(coalesce(coverImage.asset->._id, image.asset->._id, avatar.asset->._id, repositoryImageUrl))}',
  {},
  { perspective: "raw" },
);
await mkdir(resolve(repositoryRoot, "migration/reports"), { recursive: true });
await writeFile(
  resolve(repositoryRoot, "migration/reports/import.json"),
  JSON.stringify({ ...plan, created: results, documents }, null, 2) + "\n",
);
console.log(
  `Imported ${results.length} missing documents. Report: migration/reports/import.json`,
);
