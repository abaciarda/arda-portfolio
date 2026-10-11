import "server-only";
import { createClient } from "@sanity/client";
import { cache } from "react";
import turkish from "../../migration/source/content.json";
import english from "../../migration/source/content.en.json";
import type { Locale } from "../i18n/config";
import { dictionaries, isLocale } from "../i18n/config";
import type { Post, Profile, Project, SiteSettings } from "./types";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2026-02-01",
      useCdn: false,
      perspective: "published",
    })
  : null;
const image = (field: string, fallback: string) =>
  `coalesce(${field}.asset->url, ${fallback})`;
const profileProjection = `name, greeting, role, summary, introduction, biography, education, focus, skills, github, linkedin, instagram, "avatar": ${image("avatar", '"/assets/images/avatar.jpeg"')}`;
const projectProjection = `_id, title, href, date, description, "image": ${image("image", 'repositoryImageUrl, "/assets/images/repo-placeholder.webp"')}, "imageAlt": image.alt, "commits": coalesce(commits, 0), language, "featured": coalesce(featured, false)`;
const postProjection = `_id, title, "slug": slug.current, excerpt, "coverImage": ${image("coverImage", '"/assets/images/repo-placeholder.webp"')}, "coverAlt": coverImage.alt, publishedAt, category, "tags": coalesce(tags, []), seoTitle, seoDescription, author->{name, role, "avatar": ${image("avatar", '"/assets/images/avatar.jpeg"')}}, body[]{..., _type == "articleImage" => {"url": asset->url}}, "translations": (*[_type == "translation.metadata" && references(^._id)][0].translations[].value->{locale, "slug": slug.current, "available": defined(publishedAt) && publishedAt <= now() && count(body) > 0})[available == true]{locale, slug}`;
const publishedPosts = `_type == "post" && coalesce(locale, "tr") == $locale && defined(slug.current) && defined(publishedAt) && publishedAt <= now() && count(body) > 0`;

async function query<T>(
  groq: string,
  params: Record<string, string> = {},
): Promise<T | null> {
  if (!client) return null;
  return client.fetch<T>(groq, params, {
    next: { revalidate: 60, tags: ["sanity-content"] },
  });
}

function sourceFor(locale: Locale) {
  return locale === "en" ? english : turkish;
}

function normalizePost(post: Post): Post {
  return {
    ...post,
    translations: (post.translations || []).filter(
      (item) =>
        item &&
        isLocale(item.locale) &&
        typeof item.slug === "string" &&
        item.slug.length > 0,
    ),
  };
}

export const getProfile = cache(
  async (locale: Locale = "en"): Promise<Profile> => {
    const result = await query<Profile>(
      `*[_type == "profile" && _id == $id][0]{${profileProjection}}`,
      { id: locale === "en" ? "profile-en" : "profile" },
    );
    return (
      result ||
      ({
        ...sourceFor(locale).profile,
        avatar: "/assets/images/avatar.jpeg",
      } as Profile)
    );
  },
);

export const getSettings = cache(
  async (locale: Locale = "en"): Promise<SiteSettings> => {
    const settings =
      (await query<SiteSettings>(
        '*[_type == "siteSettings" && _id == $id][0]',
        { id: locale === "en" ? "siteSettings-en" : "siteSettings" },
      )) || sourceFor(locale).settings;
    const legacyLabels: Record<string, string> = {
      "/": "Anasayfa",
      "/projects": "Projects",
      "/about": "About Me",
    };
    const translatedLabels: Record<string, string> = {
      "/": dictionaries[locale].home,
      "/projects": dictionaries[locale].projects,
      "/about": dictionaries[locale].about,
    };
    return {
      ...settings,
      navigation: settings.navigation.map((item) => ({
        ...item,
        label:
          locale === "tr" && item.label === legacyLabels[item.href]
            ? translatedLabels[item.href]
            : item.label,
      })),
    };
  },
);

export const getProjects = cache(
  async (locale: Locale = "en"): Promise<Project[]> => {
    const result = await query<Project[]>(
      `*[_type == "project" && coalesce(locale, "tr") == $locale] | order(order asc, _createdAt asc){${projectProjection}}`,
      { locale },
    );
    if (client) return result || [];
    return sourceFor(locale).projects.map((item, index) => ({
      ...item,
      _id: `local-${locale}-project-${index}`,
      href: item.href === "#" ? undefined : item.href,
      language: item.language.name,
      featured: true,
    }));
  },
);

function localPosts(locale: Locale): Post[] {
  const source = sourceFor(locale);
  return source.posts.map((post) => ({
    ...post,
    _id: `local-${locale}-${post.slug.current}`,
    slug: post.slug.current,
    coverImage: post.coverPath,
    author: {
      name: source.profile.name,
      role: source.profile.role,
      avatar: "/assets/images/avatar.jpeg",
    },
    translations: [
      { locale: "en", slug: post.slug.current },
      { locale: "tr", slug: post.slug.current },
    ],
  })) as Post[];
}

export const getPosts = cache(
  async (locale: Locale = "en"): Promise<Post[]> => {
    if (!client) return localPosts(locale);
    const posts =
      (await query<Post[]>(
        `*[${publishedPosts}] | order(publishedAt desc){${postProjection}}`,
        { locale },
      )) || [];
    return posts.map(normalizePost);
  },
);

export const getPost = cache(
  async (slug: string, locale: Locale = "en"): Promise<Post | null> => {
    if (!client)
      return localPosts(locale).find((post) => post.slug === slug) || null;
    const post = await query<Post>(
      `*[${publishedPosts} && slug.current == $slug][0]{${postProjection}}`,
      { slug, locale },
    );
    return post ? normalizePost(post) : null;
  },
);
