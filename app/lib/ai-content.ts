import type { Locale } from "../i18n/config";
import { localizedPath } from "../i18n/config";
import type { Post, Profile, Project, RichTextNode, SiteSettings } from "../sanity/types";
import { absoluteUrl } from "./seo";

export interface AiContent {
  locale: Locale;
  profile: Profile;
  settings: SiteSettings;
  projects: Project[];
  posts: Post[];
}

const line = (value: string) => value.replace(/\s+/g, " ").trim();
const label = (value: string) => line(value).replace(/[\[\]\\]/g, "\\$&");
const link = (title: string, path: string) => `[${label(title)}](${absoluteUrl(path)})`;

type ContentObject = Record<string, unknown>;
function objects(value: unknown): ContentObject[] {
  return Array.isArray(value)
    ? value.filter((item): item is ContentObject => !!item && typeof item === "object")
    : [];
}
const text = (value: unknown) => typeof value === "string" ? value : "";

// Render the same Portable Text blocks as RichText.tsx, including custom blocks.
// No separate marketing copy or unpublished content is introduced here.
export function richTextMarkdown(blocks: RichTextNode[]): string {
  return blocks.map((block) => {
    const value = block as ContentObject;
    if (block._type === "block") {
      const content = objects(value.children).map((child) => {
        if (child._type === "badge") return text(child.label);
        let result = text(child.text);
        for (const mark of Array.isArray(child.marks) ? child.marks : []) {
          if (mark === "strong") result = `**${result}**`;
          if (mark === "em") result = `*${result}*`;
          if (mark === "code") result = `\`${result.replace(/`/g, "\\`")}\``;
          const definition = objects(value.markDefs).find((item) => item._key === mark);
          const href = text(definition?.href);
          if (definition?._type === "link" && /^(https?:\/\/|mailto:|\/(?!\/)|#)/.test(href)) {
            result = `[${result}](${href.startsWith("/") ? absoluteUrl(href) : href})`;
          }
        }
        return result;
      }).join("");
      if (value.listItem) return `${value.listItem === "number" ? "1." : "-"} ${content}`;
      if (/^h[1-6]$/.test(text(value.style))) return `${"#".repeat(Number(text(value.style).slice(1)))} ${content}`;
      if (value.style === "blockquote") return `> ${content.replace(/\n/g, "\n> ")}`;
      return content;
    }
    if (block._type === "codeBlock") {
      const code = text(value.code);
      const fence = "`".repeat(Math.max(3, ...Array.from(code.matchAll(/`+/g), (match) => match[0].length + 1)));
      return `${fence}${line(text(value.language))}\n${code}\n${fence}`;
    }
    if (block._type === "notice") {
      return [text(value.title), richTextMarkdown(objects(value.body) as RichTextNode[])].filter(Boolean).join("\n\n");
    }
    if (block._type === "comparisonTable") {
      const cell = (item: unknown) => line(text(item)).replace(/\|/g, "\\|");
      const columns = Array.isArray(value.columns) ? value.columns : [];
      return [
        `| ${columns.map(cell).join(" | ")} |`,
        `| ${columns.map(() => "---").join(" | ")} |`,
        ...objects(value.rows).map((row) => `| ${(Array.isArray(row.cells) ? row.cells : []).map(cell).join(" | ")} |`),
      ].join("\n");
    }
    if (block._type === "benchmark") {
      return objects(value.items).map((item) => `- ${text(item.label)}: ${text(item.before)} → ${text(item.after)} (${text(item.improvement)})`).join("\n");
    }
    if (block._type === "featureList") {
      return objects(value.items).map((item) => `- **${text(item.title)}**${item.badge ? ` (${text(item.badge)})` : ""}: ${text(item.description)}`).join("\n");
    }
    if (block._type === "articleImage") {
      return [value.url ? `![${label(text(value.alt))}](${absoluteUrl(text(value.url))})` : "", text(value.caption)].filter(Boolean).join("\n\n");
    }
    return "";
  }).filter(Boolean).join("\n\n");
}

export function llmsIndex(content: AiContent[]): string {
  const primary = content.find((item) => item.locale === "en") || content[0];
  return [
    `# ${primary.profile.name}`,
    `> ${line(primary.profile.introduction)}`,
    "Personal developer portfolio and blog. English pages use unprefixed URLs; Turkish pages use /tr. The linked pages are the canonical sources for each topic.",
    ...content.flatMap(({ locale, profile, settings, posts }) => [
      `## ${locale === "en" ? "English" : "Türkçe"}`,
      `- ${link(profile.name, localizedPath(locale))}: ${line(profile.role)}`,
      `- ${link(locale === "en" ? "About" : "Hakkımda", localizedPath(locale, "/about"))}: Biography, education, skills, and public social profiles.`,
      `- ${link(settings.projectsTitle, localizedPath(locale, "/projects"))}: ${line(settings.projectsIntroduction)}`,
      `- ${link(settings.blogTitle, localizedPath(locale, "/blog"))}: ${line(settings.blogIntroduction)}`,
      ...posts.map((post) => `- ${link(post.title, localizedPath(locale, `/blog/${post.slug}`))}: ${line(post.excerpt)}`),
    ]),
    "## Optional",
    `- ${link("Full published content", "/llms-full.txt")}: Markdown export of the profile, projects, and articles in both languages, with canonical source URLs.`,
    `- ${link("Sitemap", "/sitemap.xml")}: Canonical pages and language alternates.`,
  ].join("\n\n") + "\n";
}

export function llmsFull(content: AiContent[]): string {
  return content.map(({ locale, profile, settings, projects, posts }) => [
    `# ${profile.name} — ${locale === "en" ? "English" : "Türkçe"}`,
    `Source: ${absoluteUrl(localizedPath(locale))}\nLanguage: ${locale}`,
    profile.role,
    profile.summary,
    `## ${locale === "en" ? "About" : "Hakkımda"}`,
    `Source: ${absoluteUrl(localizedPath(locale, "/about"))}`,
    profile.introduction,
    richTextMarkdown(profile.biography),
    ...(profile.experience?.length
      ? [
          `### ${locale === "en" ? "Experience" : "Deneyim"}`,
          ...profile.experience.map((item) =>
            [
              `- ${item.role}, ${[item.company, item.employmentType, item.location].filter(Boolean).join(", ")} (${item.startDate} – ${item.endDate || (locale === "en" ? "present" : "günümüz")})`,
              ...(item.highlights || []).map((highlight) => `  - ${highlight}`),
            ].join("\n"),
          ),
        ]
      : []),
    `### ${locale === "en" ? "Education" : "Eğitim"}`,
    richTextMarkdown(profile.education),
    `### ${locale === "en" ? "Focus" : "Odak Alanları"}`,
    richTextMarkdown(profile.focus),
    `### ${locale === "en" ? "Skills" : "Yetenekler"}`,
    profile.skills.join(", "),
    ...(["github", "linkedin", "instagram"] as const).flatMap((key) => profile[key] ? [`${key}: ${profile[key]}`] : []),
    `## ${settings.projectsTitle}`,
    `Source: ${absoluteUrl(localizedPath(locale, "/projects"))}`,
    settings.projectsIntroduction,
    ...projects.flatMap((project) => [
      `### ${project.title}`,
      project.description,
      `Date: ${project.date}\nTechnology: ${project.language}`,
      ...(project.href ? [`Project: ${project.href}`] : []),
    ]),
    `## ${settings.blogTitle}`,
    `Source: ${absoluteUrl(localizedPath(locale, "/blog"))}`,
    settings.blogIntroduction,
    ...posts.flatMap((post) => [
      "---",
      `# ${post.title}`,
      `Source: ${absoluteUrl(localizedPath(locale, `/blog/${post.slug}`))}\nLanguage: ${locale}\nPublished: ${post.publishedAt}${post.updatedAt ? `\nUpdated: ${post.updatedAt}` : ""}${post.author ? `\nAuthor: ${post.author.name}` : ""}`,
      post.excerpt,
      richTextMarkdown(post.body),
      `Tags: ${post.tags.join(", ")}`,
    ]),
  ].filter(Boolean).join("\n\n")).join("\n\n---\n\n") + "\n";
}
