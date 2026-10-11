import type { Metadata } from "next";
import BlogCard from "../../components/BlogCard";
import PageHeader from "../../components/PageHeader";
import { getPosts, getSettings } from "../../sanity/content";
import {
  dictionaries,
  formatDate,
  languageAlternates,
  localizedPath,
} from "../../i18n/config";
import { getLocale, type LocaleProps } from "../../i18n/server";

export async function generateMetadata({
  params,
}: LocaleProps): Promise<Metadata> {
  const locale = await getLocale(params);
  return {
    title: dictionaries[locale].blog,
    alternates: languageAlternates(localizedPath(locale, "/blog")),
  };
}

export default async function BlogPage({ params }: LocaleProps) {
  const locale = await getLocale(params);
  const [posts, settings] = await Promise.all([
    getPosts(locale),
    getSettings(locale),
  ]);
  return (
    <main className="flex flex-col">
      <PageHeader>
        <h1 className="text-3xl font-bold tracking-tight">
          {settings.blogTitle}
        </h1>
        <p className="text-lg text-foreground/50 font-extralight max-w-150 leading-relaxed mt-2">
          {settings.blogIntroduction}
        </p>
      </PageHeader>
      <section className="container mx-auto py-12 px-4">
        {posts.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 border border-foreground/10 border-b-0 border-r-0">
            {posts.map((post) => (
              <BlogCard
                key={post._id}
                title={post.title}
                image={post.coverImage}
                excerpt={post.excerpt}
                locale={locale}
                date={formatDate(post.publishedAt, locale)}
                slug={post.slug}
                category={post.category}
              />
            ))}
          </div>
        ) : (
          <p className="text-foreground/50">{dictionaries[locale].noPosts}</p>
        )}
      </section>
    </main>
  );
}
