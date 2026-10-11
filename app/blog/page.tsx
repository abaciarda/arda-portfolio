import type { Metadata } from "next";
import BlogCard from "../components/BlogCard";
import PageHeader from "../components/PageHeader";
import { formatDate, getPosts, getSettings } from "../sanity/content";

export const metadata: Metadata = {
  title: "Blog",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const [posts, settings] = await Promise.all([getPosts(), getSettings()]);
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
                date={formatDate(post.publishedAt)}
                slug={post.slug}
                category={post.category}
              />
            ))}
          </div>
        ) : (
          <p className="text-foreground/50">Henüz yayınlanmış yazı yok.</p>
        )}
      </section>
    </main>
  );
}
