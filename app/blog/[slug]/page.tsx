import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import type { PortableTextBlock } from "@portabletext/types";
import { toPlainText } from "@portabletext/react";
import { notFound } from "next/navigation";
import { formatDate, getPost } from "../../sanity/content";
import RichText, { headingId } from "../../components/RichText";
import TableOfContents from "../components/TableOfContents";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author.name] : [],
      url: `https://ardaabaci.com/blog/${post.slug}`,
      images: [{ url: post.coverImage, alt: post.coverAlt || post.title }],
    },
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
  const post = await getPost(slug);
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
  return (
    <main className="flex flex-col">
      <header className="min-h-120 relative flex items-center justify-center overflow-hidden py-24">
        <div className="absolute inset-0 dot-splash z-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-950/60 via-black to-cyan-950/40" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 relative z-20 flex flex-col gap-3">
          <Link
            href="/blog"
            className="text-xs text-foreground/40 hover:text-white mb-2"
          >
            ← Tüm yazılar
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/40">
            <span>{post.category}</span>
            <span>·</span>
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
            <span>·</span>
            <span>{readTime} dk okuma</span>
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
              <span className="text-sm text-foreground/60 font-light">
                {post.author.name}
              </span>
            </div>
          )}
        </div>
      </header>
      <section className="container mx-auto py-12 px-4">
        <div className="grid lg:grid-cols-[220px_minmax(0,1fr)] gap-10 lg:gap-16">
          {headings.length > 0 && (
            <aside className="hidden lg:block">
              <TableOfContents sections={headings} />
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
              href="/blog"
              className="block mt-8 border-t border-foreground/10 pt-6 text-xs text-foreground/40 hover:text-white"
            >
              ← Tüm yazılar
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}
