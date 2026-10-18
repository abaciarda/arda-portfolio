import type { MetadataRoute } from "next";
import { languageAlternates, locales, localizedPath } from "./i18n/config";
import { absoluteUrl, postAlternates } from "./lib/seo";
import { getPosts } from "./sanity/content";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await Promise.all(locales.map(async (locale) => {
    const posts = await getPosts(locale);
    return [
      ...["/", "/about", "/projects", "/blog"].map((path) => ({
        url: absoluteUrl(localizedPath(locale, path)),
        alternates: { languages: Object.fromEntries(Object.entries(languageAlternates(path).languages).map(([language, href]) => [language, absoluteUrl(href)])) },
      })),
      ...posts.map((post) => ({
        url: absoluteUrl(localizedPath(locale, `/blog/${post.slug}`)),
        lastModified: post.updatedAt || post.publishedAt,
        alternates: { languages: Object.fromEntries(Object.entries(postAlternates(post, locale).languages).map(([language, href]) => [language, absoluteUrl(href)])) },
      })),
    ];
  }));
  return entries.flat();
}
