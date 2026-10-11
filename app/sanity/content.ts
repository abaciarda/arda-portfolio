import "server-only";
import { createClient } from "@sanity/client";
import { cache } from "react";
import source from "../../migration/source/content.json";
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
const postProjection = `_id, title, "slug": slug.current, excerpt, "coverImage": ${image("coverImage", '"/assets/images/repo-placeholder.webp"')}, "coverAlt": coverImage.alt, publishedAt, category, "tags": coalesce(tags, []), seoTitle, seoDescription, author->{name, role, "avatar": ${image("avatar", '"/assets/images/avatar.jpeg"')}}, body[]{..., _type == "articleImage" => {"url": asset->url}}`;
const publishedPosts = `_type == "post" && defined(slug.current) && defined(publishedAt) && publishedAt <= now() && count(body) > 0`;

async function query<T>(
  groq: string,
  params: Record<string, string> = {},
): Promise<T | null> {
  if (!client) return null;
  return client.fetch<T>(groq, params, {
    next: { revalidate: 60, tags: ["sanity-content"] },
  });
}

export const getProfile = cache(async (): Promise<Profile> => {
  const result = await query<Profile>(
    `*[_type == "profile" && _id == "profile"][0]{${profileProjection}}`,
  );
  return (
    result ||
    ({ ...source.profile, avatar: "/assets/images/avatar.jpeg" } as Profile)
  );
});

export const getSettings = cache(async (): Promise<SiteSettings> => {
  return (
    (await query<SiteSettings>(
      '*[_type == "siteSettings" && _id == "siteSettings"][0]',
    )) || source.settings
  );
});

export const getProjects = cache(async (): Promise<Project[]> => {
  const result = await query<Project[]>(
    `*[_type == "project"] | order(order asc, _createdAt asc){${projectProjection}}`,
  );
  if (client) return result || [];
  return source.projects.map((item, index) => ({
    ...item,
    _id: `local-project-${index}`,
    href: item.href === "#" ? undefined : item.href,
    language: item.language.name,
    featured: true,
  }));
});

const localPosts: Post[] = source.posts.map((post) => ({
  ...post,
  _id: `local-${post.slug.current}`,
  slug: post.slug.current,
  coverImage: post.coverPath,
  author: {
    name: source.profile.name,
    role: source.profile.role,
    avatar: "/assets/images/avatar.jpeg",
  },
})) as Post[];

export const getPosts = cache(async (): Promise<Post[]> => {
  if (!client) return localPosts;
  return (
    (await query<Post[]>(
      `*[${publishedPosts}] | order(publishedAt desc){${postProjection}}`,
    )) || []
  );
});

export const getPost = cache(async (slug: string): Promise<Post | null> => {
  if (!client) return localPosts.find((post) => post.slug === slug) || null;
  return query<Post>(
    `*[${publishedPosts} && slug.current == $slug][0]{${postProjection}}`,
    { slug },
  );
});

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Istanbul",
  }).format(new Date(date));
}
