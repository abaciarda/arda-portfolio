import type { Metadata } from "next";
import { languageAlternates, localizedPath, type Locale } from "../i18n/config";
import type { Post, Profile } from "../sanity/types";

export const SITE_URL = "https://ardaabaci.com";
export const absoluteUrl = (path: string) => new URL(path, SITE_URL).href;

export function pageMetadata({ locale, path = "/", title, description, profile, siteName, home = false }: {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  profile: Profile;
  siteName: string;
  home?: boolean;
}): Metadata {
  const fullTitle = home ? title : `${title} | ${profile.name}`;
  return {
    title: home ? { absolute: title } : title,
    description,
    alternates: languageAlternates(localizedPath(locale, path)),
    openGraph: {
      type: "website",
      title: fullTitle,
      description,
      url: absoluteUrl(localizedPath(locale, path)),
      siteName,
      locale: locale === "en" ? "en_US" : "tr_TR",
      alternateLocale: [locale === "en" ? "tr_TR" : "en_US"],
      images: [{ url: profile.avatar, alt: profile.name }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [profile.avatar] },
  };
}

export function postAlternates(post: Pick<Post, "slug" | "translations">, locale: Locale) {
  const translations = [...(post.translations || []), { locale, slug: post.slug }];
  const languages = Object.fromEntries(translations.map((translation) => [
    translation.locale,
    localizedPath(translation.locale, `/blog/${translation.slug}`),
  ]));
  if (languages.en) languages["x-default"] = languages.en;
  return { canonical: localizedPath(locale, `/blog/${post.slug}`), languages };
}

export function personData(profile: Profile) {
  return {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: profile.name,
    url: absoluteUrl("/about"),
    image: absoluteUrl(profile.avatar),
    jobTitle: profile.role,
    description: profile.introduction,
    sameAs: [profile.github, profile.linkedin, profile.instagram].filter(Boolean),
    knowsAbout: profile.skills,
  };
}

// Escape CMS text so it cannot terminate the JSON-LD script element.
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
