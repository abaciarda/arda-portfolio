import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getLatestCommits } from "../actions/commits";
import { getProfile, getProjects } from "../sanity/content";
import PageHeader from "../components/PageHeader";
import { Skills, SocialLinks } from "../components/ProfileDetails";
import {
  dictionaries,
  formatDate,
  languageAlternates,
  localizedPath,
} from "../i18n/config";
import { getLocale, type LocaleProps } from "../i18n/server";

export async function generateMetadata({
  params,
}: LocaleProps): Promise<Metadata> {
  const locale = await getLocale(params);
  return {
    title: dictionaries[locale].home,
    alternates: languageAlternates(localizedPath(locale)),
  };
}

export default async function Home({ params }: LocaleProps) {
  const locale = await getLocale(params);
  const t = dictionaries[locale];
  const [profile, projects, commits] = await Promise.all([
    getProfile(locale),
    getProjects(locale),
    getLatestCommits(),
  ]);
  return (
    <main className="flex flex-col">
      <PageHeader>
        <div className="flex flex-col items-center gap-1 text-center">
          <Image
            src={profile.avatar}
            alt={profile.name}
            width={128}
            height={128}
            priority
            className="size-32 rounded-full mb-2 object-cover"
          />
          <h1 className="text-3xl font-semibold">{profile.greeting}</h1>
          <p className="text-lg text-foreground/50 font-extralight">
            {profile.role}
          </p>
          <SocialLinks profile={profile} />
        </div>
      </PageHeader>
      <section className="container mx-auto grid lg:grid-cols-2 gap-10 py-12 px-4">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold">{t.biography}</h2>
            <p className="text-foreground/50 font-light leading-relaxed">
              {profile.summary}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold">{t.techStack}</h2>
            <Skills items={profile.skills} />
          </div>
        </div>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold">{t.myProjects}</h2>
            {projects
              .filter((project) => project.featured)
              .map((project) => (
                <div
                  key={project._id}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="font-medium">{project.title}</span>
                  <div className="flex-1 border-t border-foreground/[0.06] border-dashed" />
                  <span className="text-foreground/60 whitespace-nowrap hidden md:block">
                    {project.date}
                  </span>
                </div>
              ))}
            <Link
              href={localizedPath(locale, "/projects")}
              className="text-sm text-foreground/50 hover:text-white"
            >
              {t.allProjects} →
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold">{t.activity}</h2>
            {commits.length ? (
              commits.map((commit) => (
                <div
                  key={`${commit.repo}:${commit.sha}`}
                  className="flex flex-wrap items-center gap-1 font-light text-foreground/50"
                >
                  <span>{formatDate(commit.date, locale, true)} –</span>
                  <span className="wrap-anywhere">
                    {commit.message.split("\n")[0]}
                  </span>
                  <a
                    href={commit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    {commit.repo}
                  </a>
                </div>
              ))
            ) : (
              <p className="text-foreground/50 font-light">
                {t.activityUnavailable}
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
