import { pageMetadata } from "../../lib/seo";
import Image from "next/image";
import type { Metadata } from "next";
import { getProfile, getProjects, getSettings } from "../../sanity/content";
import PageHeader from "../../components/PageHeader";
import { SocialLinks } from "../../components/ProfileDetails";
import type { Project } from "../../sanity/types";
import {
  dictionaries,
} from "../../i18n/config";
import { getLocale, type LocaleProps } from "../../i18n/server";

export async function generateMetadata({
  params,
}: LocaleProps): Promise<Metadata> {
  const locale = await getLocale(params);
  const [profile, settings] = await Promise.all([getProfile(locale), getSettings(locale)]);
  return pageMetadata({ locale, path: "/projects", title: dictionaries[locale].projects, description: settings.projectsIntroduction, profile, siteName: settings.siteTitle });
}

const cardClass =
  "group relative flex flex-col gap-3 p-3 rounded-sm border border-white/10 transition-colors duration-200 hover:border-white/25 hover:bg-foreground/2 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white before:origin-left before:scale-x-0 before:transition-transform before:duration-300 hover:before:scale-x-100";

function ProjectContent({ project, index }: { project: Project; index: number }) {
  return (
    <>
      <div className="aspect-[2/1] overflow-hidden rounded-sm border border-white/10 bg-black/20">
        <Image
          className="size-full object-cover opacity-70 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-[1.03] transition duration-300"
          src={project.image}
          width={640}
          height={320}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          alt={project.imageAlt || project.title}
        />
      </div>
      <div className="flex items-baseline gap-2 min-w-0">
        <span className="font-mono text-xs text-foreground/30 group-hover:text-white transition-colors">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h2 className="text-sm font-medium truncate group-hover:text-white transition-colors">
          {project.title}
        </h2>
        {project.href && (
          <span
            aria-hidden="true"
            className="ml-auto text-foreground/30 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition"
          >
            ↗
          </span>
        )}
      </div>
      <p className="text-sm text-foreground/40 font-light truncate">
        {project.description}
      </p>
      <span className="mt-auto font-mono text-[11px] uppercase tracking-wider text-foreground/40">
        {[project.language, project.commits > 0 && `${project.commits} commits`, project.date]
          .filter(Boolean)
          .join(" · ")}
      </span>
    </>
  );
}

export default async function ProjectsPage({ params }: LocaleProps) {
  const locale = await getLocale(params);
  const [projects, profile, settings] = await Promise.all([
    getProjects(locale),
    getProfile(locale),
    getSettings(locale),
  ]);
  return (
    <main className="flex flex-col">
      <PageHeader>
        <h1 className="text-3xl font-semibold">{settings.projectsTitle}</h1>
        <p className="text-lg text-foreground/50 font-extralight max-w-150 mt-1">
          {settings.projectsIntroduction}
        </p>
        <SocialLinks profile={profile} />
      </PageHeader>
      <section className="container mx-auto py-12 px-4">
        <div className="flex items-center justify-between gap-4 pb-3 border-b border-white/10 font-mono text-[11px] uppercase tracking-widest text-foreground/40">
          <span>{dictionaries[locale].allProjects}</span>
          <span>{String(projects.length).padStart(2, "0")}</span>
        </div>
        {projects.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
            {projects.map((project, index) =>
              project.href ? (
                <a
                  href={project.href}
                  className={cardClass}
                  key={project._id}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ProjectContent project={project} index={index} />
                </a>
              ) : (
                <article className={cardClass} key={project._id}>
                  <ProjectContent project={project} index={index} />
                </article>
              ),
            )}
          </div>
        ) : (
          <p className="text-foreground/50 pt-4">
            {dictionaries[locale].noProjects}
          </p>
        )}
      </section>
    </main>
  );
}
