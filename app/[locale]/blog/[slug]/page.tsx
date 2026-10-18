import JsonLd from "../../../components/JsonLd";
import { absoluteUrl, postAlternates, SITE_URL } from "../../../lib/seo";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import type { PortableTextBlock } from "@portabletext/types";
import { toPlainText } from "@portabletext/react";
import { notFound } from "next/navigation";
import { getPost } from "../../../sanity/content";
import RichText, { headingId } from "../../../components/RichText";
import TableOfContents from "../../../blog/components/TableOfContents";
import {
  dictionaries,
  formatDate,
  localizedPath,
  type Locale,
} from "../../../i18n/config";
import { getLocale } from "../../../i18n/server";
import { ArticleLanguageLinks } from "../../../components/LanguageLinks";

type Props = { params: Promise<{ slug: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale(params);
  const post = await getPost(slug, locale);
  if (!post) notFound();
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  return {
    title,
    description,
    alternates: postAlternates(post, locale),
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      authors: post.author ? [post.author.name] : [],
      url: `https://ardaabaci.com${localizedPath(locale, `/blog/${post.slug}`)}`,
      locale: locale === "en" ? "en_US" : "tr_TR",
      images: [{ url: post.coverImage, alt: post.coverAlt || post.title }],
    },
    authors: post.author ? [{ name: post.author.name, url: absoluteUrl(localizedPath(locale, "/about")) }] : undefined,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale(params);
  const t = dictionaries[locale];
  const post = await getPost(slug, locale);
  if (!post) notFound();
  const textBlocks = post.body.filter(
    (block): block is PortableTextBlock => block._type === "block",
  );
  const headings = textBlocks
    .filter((block) => block.style === "h2")
    .map((block) => ({ id: headingId(block), title: toPlainText(block) }));
  const readTime = Math.max(
    1,
    Math.ceil(toPlainText(textBlocks).split(/\s+/).length / 200),
  );
  const paths: Record<Locale, string> = { en: "/blog", tr: "/tr/blog" };
  paths[locale] = localizedPath(locale, `/blog/${post.slug}`);
  for (const translation of post.translations || [])
    paths[translation.locale] = localizedPath(
      translation.locale,
      `/blog/${translation.slug}`,
    );
  return (
    <main className="flex flex-col">
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [
        {
          "@type": "BlogPosting",
          "@id": absoluteUrl(localizedPath(locale, "/blog/" + post.slug)) + "#article",
          headline: post.title,
          description: post.seoDescription || post.excerpt,
          image: absoluteUrl(post.coverImage),
          datePublished: post.publishedAt,
          ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
          inLanguage: locale,
          mainEntityOfPage: absoluteUrl(localizedPath(locale, "/blog/" + post.slug)),
          author: post.author ? { "@type": "Person", name: post.author.name, url: absoluteUrl(localizedPath(locale, "/about")) } : undefined,
          isPartOf: { "@id": SITE_URL + "/#website" },
          keywords: post.tags.join(", "),
        },
        { "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: t.home, item: absoluteUrl(localizedPath(locale)) },
          { "@type": "ListItem", position: 2, name: t.blog, item: absoluteUrl(localizedPath(locale, "/blog")) },
          { "@type": "ListItem", position: 3, name: post.title, item: absoluteUrl(localizedPath(locale, "/blog/" + post.slug)) },
        ] },
      ] }} />
      <ArticleLanguageLinks paths={paths} />
      <header className="min-h-120 relative flex items-center justify-center overflow-hidden py-24">
        <div className="absolute inset-0 dot-splash z-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-950/60 via-black to-cyan-950/40" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 relative z-20 flex flex-col gap-3">
          <Link
            href={localizedPath(locale, "/blog")}
            className="text-xs text-foreground/40 hover:text-white mb-2"
          >
            ← {t.allPosts}
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/40">
            <span>{post.category}</span>
            <span>·</span>
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt, locale)}
            </time>
            <span>·</span>
            <span>
              {readTime} {t.minutes}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight max-w-3xl leading-tight">
            {post.title}
          </h1>
          <p className="text-base text-foreground/50 font-extralight leading-relaxed max-w-2xl">
            {post.excerpt}
          </p>
          {post.author && (
            <div className="flex items-center gap-2">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={28}
                height={28}
                className="size-7 rounded-full object-cover"
              />
              <Link href={localizedPath(locale, "/about")} rel="author" className="text-sm text-foreground/60 font-light hover:text-white">
                {post.author.name}
              </Link>
            </div>
          )}
        </div>
      </header>
      <section className="container mx-auto py-12 px-4">
        <div className="grid lg:grid-cols-[220px_minmax(0,1fr)] gap-10 lg:gap-16">
          {headings.length > 0 && (
            <aside className="hidden lg:block">
              <TableOfContents sections={headings} title={t.contents} />
            </aside>
          )}
          <article
            className={`min-w-0 max-w-3xl ${headings.length ? "" : "lg:col-start-2"}`}
          >
            <RichText value={post.body} />
            <div className="flex flex-wrap gap-2 pt-6 border-t border-foreground/10">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] uppercase tracking-widest text-foreground/30 bg-foreground/5 border border-foreground/10 px-2.5 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
            {post.author && (
              <div className="mt-8 p-5 border border-foreground/10 rounded flex items-start gap-4">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={48}
                  height={48}
                  className="size-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium">{post.author.name}</p>
                  <p className="text-xs text-foreground/40 font-light mt-1">
                    {post.author.role}
                  </p>
                </div>
              </div>
            )}
            <Link
              href={localizedPath(locale, "/blog")}
              className="block mt-8 border-t border-foreground/10 pt-6 text-xs text-foreground/40 hover:text-white"
            >
              ← {t.allPosts}
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}
