import { getCliClient } from "sanity/cli";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { isDeepStrictEqual } from "node:util";

const client = getCliClient({ apiVersion: "2026-02-01" }).withConfig({
  perspective: "raw",
  useCdn: false,
});
if (
  client.config().projectId !== "w78zoc2a" ||
  client.config().dataset !== "production"
)
  throw new Error("The migration must target w78zoc2a/production.");
const root = fileURLToPath(new URL("../", import.meta.url));
const english = JSON.parse(
  await readFile(resolve(root, "migration/source/content.en.json"), "utf8"),
);
const turkish = JSON.parse(
  await readFile(resolve(root, "migration/source/content.json"), "utf8"),
);
const documents = await client.fetch(
  '*[_type in ["profile", "siteSettings", "project", "post", "translation.metadata"]]',
);
const byId = new Map(documents.map((document) => [document._id, document]));
const apply = process.argv.includes("--apply");
const changes = [];
const creations = [];
const warnings = [];

function clean(document) {
  const { _rev, _createdAt, _updatedAt, ...fields } = document;
  void _rev;
  void _createdAt;
  void _updatedAt;
  return fields;
}
function markTurkish(id) {
  for (const candidate of [id, `drafts.${id}`]) {
    const document = byId.get(candidate);
    if (document && !document.locale)
      changes.push({ id: candidate, locale: "tr" });
  }
}
function create(document) {
  if (!byId.has(document._id)) {
    creations.push(document);
    byId.set(document._id, document);
  }
}
function pair(id, translation) {
  markTurkish(id);
  const existing = documents.find(
    (document) =>
      document._type === "translation.metadata" &&
      document.translations?.some((item) => item.value?._ref === id),
  );
  if (existing) {
    warnings.push(
      `Translation metadata already exists for ${id}; skipped to preserve editor changes.`,
    );
    return;
  }
  create(translation);
  const targetId = translation._id.replace(/^drafts\./, "");
  const reference = (locale, target) => ({
    _type: "internationalizedArrayReferenceValue",
    _key: locale,
    language: locale,
    value: {
      _type: "reference",
      _ref: target,
      ...(!byId.has(target)
        ? { _weak: true, _strengthenOnPublish: { type: translation._type } }
        : {}),
    },
  });
  create({
    _id: `import-translations-${id}`,
    _type: "translation.metadata",
    schemaTypes: [translation._type],
    translations: [reference("tr", id), reference("en", targetId)],
  });
}

for (const [id, fields] of [
  ["profile", english.profile],
  ["siteSettings", english.settings],
]) {
  const source = byId.get(id);
  if (!source) throw new Error(`Missing required source document: ${id}`);
  markTurkish(id);
  create({ ...clean(source), ...fields, _id: `${id}-en`, locale: "en" });
}
for (const [index, project] of turkish.projects.entries()) {
  const id = `import-project-${createHash("sha256").update(project.title).digest("hex").slice(0, 20)}`;
  const source = byId.get(id);
  if (!source) throw new Error(`Missing source project: ${project.title}`);
  if (
    source.title !== project.title ||
    source.description !== project.description
  )
    throw new Error(
      `The source project has changed since the translation snapshot: ${project.title}. Review the English translation before importing.`,
    );
  pair(id, {
    ...clean(source),
    _id: `${id}-en`,
    locale: "en",
    title: english.projects[index].title,
    description: english.projects[index].description,
  });
}
for (const post of english.posts) {
  const id = `import-post-${post.slug.current}`;
  const source = byId.get(id);
  if (!source) throw new Error(`Missing source article: ${post.slug.current}`);
  const original = turkish.posts.find(
    (item) => item.slug.current === post.slug.current,
  );
  if (
    !isDeepStrictEqual(source.body, original.body) ||
    source.title !== original.title ||
    source.excerpt !== original.excerpt
  )
    throw new Error(
      "The source article has changed since the translation snapshot. Review the English translation before importing.",
    );
  const { coverPath, ...fields } = post;
  void coverPath;
  pair(id, {
    ...clean(source),
    ...fields,
    _id: `${id}-en`,
    locale: "en",
    author: { _type: "reference", _ref: "profile-en" },
    coverImage: { ...source.coverImage, alt: post.title },
  });
}
for (const [slug, fields] of [
  [
    "nextjs-15-yenilikler",
    {
      title: "What’s New in Next.js 15",
      excerpt:
        "A look at App Router improvements, partial prerendering, and React 19 support.",
      category: "Development",
    },
  ],
  [
    "full-stack-yol-haritasi",
    {
      title: "The Full-Stack Developer Roadmap",
      excerpt:
        "Which technologies should a full-stack developer focus on in 2026? Notes on the modern web ecosystem.",
      category: "Career",
    },
  ],
]) {
  const id = `import-post-${slug}`;
  const source = byId.get(`drafts.${id}`);
  const published = byId.get(id);
  if (published && slug === "nextjs-15-yenilikler") {
    const spans =
      published.body?.flatMap((block) => block.children || []) || [];
    if (spans.length === 1 && spans[0].text === "test body") {
      pair(id, {
        ...clean(published),
        ...fields,
        _id: `${id}-en`,
        locale: "en",
        author: { _type: "reference", _ref: "profile-en" },
        coverImage: { ...published.coverImage, alt: fields.title },
      });
    } else
      warnings.push(
        `Skipped ${slug}: its newly published body needs an English translation review.`,
      );
    continue;
  }
  if (!source || published) {
    warnings.push(
      `Skipped ${slug}: source draft is missing or has been published.`,
    );
    continue;
  }
  pair(id, {
    ...clean(source),
    ...fields,
    _id: `drafts.${id}-en`,
    locale: "en",
    author: { _type: "reference", _ref: "profile-en" },
  });
}

const plan = {
  mode: apply ? "apply" : "dry run",
  projectId: "w78zoc2a",
  dataset: "production",
  markExistingDocumentsAsTurkish: changes.length,
  createEnglishDocuments: creations.filter(
    (document) => document._type !== "translation.metadata",
  ).length,
  translationLinks: creations.filter(
    (document) => document._type === "translation.metadata",
  ).length,
  warnings,
  documents: creations.map((document) => ({
    id: document._id,
    type: document._type,
    title: document.title || document.name || document.siteTitle,
  })),
};
await mkdir(resolve(root, "migration/reports"), { recursive: true });
await writeFile(
  resolve(root, "migration/reports/localization-source.json"),
  JSON.stringify(documents, null, 2) + "\n",
);
await writeFile(
  resolve(root, "migration/reports/localization-plan.json"),
  JSON.stringify(plan, null, 2) + "\n",
);
console.log(JSON.stringify(plan, null, 2));
if (!apply) process.exit(0);
const transaction = client.transaction();
for (const change of changes)
  transaction.patch(change.id, (patch) =>
    patch.setIfMissing({ locale: change.locale }),
  );
for (const document of creations) transaction.createIfNotExists(document);
if (changes.length || creations.length) await transaction.commit();
console.log(
  "Localization import completed. Turkish content and existing English documents were preserved.",
);
