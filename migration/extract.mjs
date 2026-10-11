import fs from "node:fs";
import ts from "typescript";
import vm from "node:vm";

const read = (path) =>
  ts.createSourceFile(
    path,
    fs.readFileSync(path, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
const article = read("migration/source/article.tsx.txt");
let key = 0;
const nextKey = () => `source-${++key}`;
const evaluate = (node) =>
  vm.runInNewContext(
    ts.transpile(`(${node.getText()})`, { target: ts.ScriptTarget.ES2020 }),
  );
const name = (node) => (node.openingElement || node).tagName?.getText();
const attributes = (node) =>
  Object.fromEntries(
    [...(node.openingElement || node).attributes.properties].map((prop) => [
      prop.name.getText(),
      prop.initializer
        ? ts.isStringLiteral(prop.initializer)
          ? prop.initializer.text
          : evaluate(prop.initializer.expression)
        : true,
    ]),
  );
const span = (text, marks = []) => ({
  _type: "span",
  _key: nextKey(),
  text,
  marks,
});
function inline(nodes, marks = []) {
  return nodes.flatMap((node) => {
    if (ts.isJsxText(node)) {
      const lines = node.text.replace(/\r/g, "").split("\n");
      const text =
        lines.length === 1
          ? lines[0]
          : lines
              .map((line, index) =>
                index === 0
                  ? line.trimEnd()
                  : index === lines.length - 1
                    ? line.trimStart()
                    : line.trim(),
              )
              .filter(Boolean)
              .join(" ");
      return text ? [span(text, marks)] : [];
    }
    if (
      ts.isJsxExpression(node) &&
      node.expression &&
      ts.isStringLiteral(node.expression)
    )
      return [span(node.expression.text, marks)];
    if (ts.isJsxElement(node)) {
      const tag = name(node);
      return inline(
        node.children,
        ["strong", "em", "code"].includes(tag) ? [...marks, tag] : marks,
      );
    }
    return [];
  });
}
function paragraph(children, style = "normal", blockKey) {
  return {
    _type: "block",
    _key: blockKey || nextKey(),
    style,
    markDefs: [],
    children: inline(children),
  };
}
function descendants(node, predicate) {
  const result = [];
  function visit(child) {
    if (predicate(child)) result.push(child);
    ts.forEachChild(child, visit);
  }
  visit(node);
  return result;
}
const rows = descendants(
  read("migration/source/comparison.tsx.txt"),
  (node) => ts.isVariableDeclaration(node) && node.name.getText() === "rows",
)[0];
const tableRows = evaluate(rows.initializer);
const sections = descendants(
  article,
  (node) =>
    ts.isJsxElement(node) &&
    name(node) === "section" &&
    node.openingElement.attributes.properties.some(
      (prop) => prop.name?.getText() === "id",
    ),
);
const body = sections.flatMap((section) => {
  const result = [];
  for (const node of section.children) {
    if (ts.isJsxElement(node)) {
      const tag = name(node);
      if (tag === "h2")
        result.push(
          paragraph(
            node.children.filter(
              (child) => !ts.isJsxElement(child) || name(child) !== "span",
            ),
            "h2",
            attributes(section).id,
          ),
        );
      else if (tag === "p") result.push(paragraph(node.children));
      else if (tag === "InfoBox")
        result.push({
          _type: "notice",
          _key: nextKey(),
          ...attributes(node),
          body: [paragraph(node.children)],
        });
      else if (tag === "div") {
        const arrays = descendants(node, ts.isArrayLiteralExpression);
        for (const array of arrays) {
          const items = evaluate(array);
          if (items[0]?.v3)
            result.push({
              _type: "benchmark",
              _key: nextKey(),
              items: items.map((item) => ({
                _key: nextKey(),
                label: item.label,
                before: item.v3,
                after: item.v4,
                improvement: `${item.improvement} daha hızlı`,
              })),
            });
          else if (items[0]?.desc)
            result.push({
              _type: "featureList",
              _key: nextKey(),
              items: items.map((item) => ({
                _key: nextKey(),
                title: item.title,
                description: item.desc,
                badge: item.badge,
                color: item.color,
              })),
            });
          else throw new Error("Unsupported mapped content");
        }
      } else throw new Error(`Unsupported article element: ${tag}`);
    } else if (ts.isJsxSelfClosingElement(node)) {
      const tag = name(node);
      if (tag === "CodeBlock")
        result.push({
          _type: "codeBlock",
          _key: nextKey(),
          ...attributes(node),
        });
      else if (tag === "ComparisonTable")
        result.push({
          _type: "comparisonTable",
          _key: nextKey(),
          columns: ["Özellik", "v3", "v4"],
          rows: tableRows.map((row) => ({
            _key: nextKey(),
            cells: [row.feature, row.v3, row.v4],
          })),
        });
      else throw new Error(`Unsupported article component: ${tag}`);
    }
  }
  return result;
});
const about = read("migration/source/about.tsx.txt");
const paragraphs = descendants(
  about,
  (node) => ts.isJsxElement(node) && name(node) === "p",
);
const blocks = paragraphs.map((node) => paragraph(node.children));
const snapshot = {
  posts: [
    {
      _type: "post",
      title: "Tailwind CSS v4: PostCSS'e Veda, Hıza Merhaba",
      slug: { _type: "slug", current: "tailwind-css-v4-inceleme" },
      excerpt:
        "Konfigürasyon dosyasından CSS-first yaklaşımına, Oxide engine'den yeni @theme direktifine kadar v4'ün her köşesini inceledim. Gerçekten bu kadar hızlı mı?",
      publishedAt: "2026-03-28T09:00:00+03:00",
      category: "Tasarım",
      tags: ["tailwindcss", "css", "frontend", "performans"],
      coverPath: "/assets/images/blog/tailwind-article.webp",
      body,
    },
  ],
  projects: JSON.parse(fs.readFileSync("app/data/project-items.json", "utf8"))
    .projects,
  profile: {
    _type: "profile",
    name: "Arda Abacı",
    greeting: "Merhaba, Ben Arda 👋",
    role: "Jr. Full-Stack Web Developer",
    summary:
      "Merhaba, ben Arda Abacı. 19 yaşındayım ve Junior Full-Stack Developer olarak web geliştirme alanında çalışıyorum. Frontend tarafında HTML, CSS, TailwindCSS ve React/Next.js ile modern, responsive ve kullanıcı odaklı arayüzler geliştiriyorum. Backend tarafında Node.js ile temel API geliştirme ve veritabanı entegrasyonu üzerine çalışıyor, full-stack mimarileri anlamaya ve uygulamaya odaklanıyorum.",
    introduction:
      "Modern web teknolojileri kullanarak ölçeklenebilir frontend arayüzler ve backend servisler geliştiren bir Jr. Full-Stack Developer’ım.",
    biography: blocks.slice(0, 2),
    education: blocks.slice(2, 4),
    focus: blocks.slice(4, 6),
    skills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind",
      "CSS",
      "Node.js",
      "PHP",
      "Laravel",
      "MongoDB",
      "MySQL",
      "Git",
    ],
    github: "https://github.com/abaciarda",
    linkedin: "https://www.linkedin.com/in/arda-abacı-631302320/",
    instagram: "https://www.instagram.com/ardaabacii_/",
  },
  settings: {
    _type: "siteSettings",
    siteTitle: "Arda Abacı | Jr. Full-Stack Developer",
    description:
      "Modern web teknolojileri ile geliştirilmiş kişisel portfolyo ve blog sitesi. React, Next.js ve Node.js projelerimi inceleyin.",
    navigation: JSON.parse(
      fs.readFileSync("app/data/navbar-items.json", "utf8"),
    ).navbar_items.map((item) => ({ _key: nextKey(), ...item })),
    projectsTitle: "Katkıda Bulunduğum Projeler",
    projectsIntroduction:
      "Açık kaynak projelerde ve bireysel çalışmalarda full-stack geliştirme, backend API tasarımı, frontend arayüz geliştirme ve component mimarisi üzerine yaptığım katkıları içerir.",
    blogTitle: "Son Blog Yazılarım",
    blogIntroduction:
      "Deneyimlerimi, teknik notlarımı ve web geliştirme dünyasından paylaştığım yazıları burada bulabilirsiniz.",
  },
};
fs.mkdirSync("migration/source", { recursive: true });
fs.writeFileSync(
  "migration/source/content.json",
  JSON.stringify(snapshot, null, 2) + "\n",
);
console.log(
  JSON.stringify({
    posts: snapshot.posts.length,
    projects: snapshot.projects.length,
    articleBlocks: body.length,
    profileParagraphs: blocks.length,
  }),
);
