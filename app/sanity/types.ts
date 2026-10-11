import type { PortableTextBlock } from "@portabletext/types";
import type { Locale } from "../i18n/config";

export type Color = "blue" | "green" | "orange" | "default";
export type RichTextNode =
  PortableTextBlock | { _type: string; _key: string; [key: string]: unknown };
export interface Profile {
  name: string;
  greeting: string;
  role: string;
  avatar: string;
  summary: string;
  introduction: string;
  biography: RichTextNode[];
  education: RichTextNode[];
  focus: RichTextNode[];
  skills: string[];
  github?: string;
  linkedin?: string;
  instagram?: string;
}
export interface Project {
  _id: string;
  title: string;
  href?: string;
  date: string;
  description: string;
  image: string;
  imageAlt?: string;
  commits: number;
  language: string;
  featured: boolean;
}
export interface Post {
  translations?: { locale: Locale; slug: string }[];
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  coverAlt?: string;
  publishedAt: string;
  category: string;
  tags: string[];
  author: Pick<Profile, "name" | "role" | "avatar"> | null;
  body: RichTextNode[];
  seoTitle?: string;
  seoDescription?: string;
}
export interface SiteSettings {
  homepageProjectsSource?: "featured" | "github";
  siteTitle: string;
  description: string;
  navigation: { _key: string; label: string; href: string }[];
  projectsTitle: string;
  projectsIntroduction: string;
  blogTitle: string;
  blogIntroduction: string;
}
