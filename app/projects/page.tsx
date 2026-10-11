import Image from "next/image";
import type { Metadata } from "next";
import { GoCommit } from "react-icons/go";
import { SiGithub } from "react-icons/si";
import { getProfile, getProjects, getSettings } from "../sanity/content";
import PageHeader from "../components/PageHeader";
import { SocialLinks } from "../components/ProfileDetails";
import type { Project } from "../sanity/types";

export const metadata: Metadata = {
  title: "Projeler",
  alternates: { canonical: "/projects" },
};

function ProjectContent({ project }: { project: Project }) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {project.href?.startsWith("https://github.com/") && (
            <SiGithub className="shrink-0" />
          )}
          <h2 className="text-sm">{project.title}</h2>
        </div>
        <p className="text-xs text-foreground/70 font-extralight whitespace-nowrap">
          {project.date}
        </p>
      </div>
      <Image
        className="rounded max-h-58 w-full object-cover"
        src={project.image}
        width={500}
        height={230}
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
        alt={project.imageAlt || project.title}
      />
      <p className="text-sm text-foreground/70 font-light">
        {project.description}
      </p>
      <div className="flex items-center gap-4">
        {project.commits > 0 && (
          <div className="flex items-center gap-1">
            <GoCommit className="text-sm" />
            <span className="text-xs text-foreground/70 font-light">
              {project.commits}
            </span>
          </div>
        )}
        <span className="text-xs text-foreground/70 font-light">
          {project.language}
        </span>
      </div>
    </>
  );
}

export default async function ProjectsPage() {
  const [projects, profile, settings] = await Promise.all([
    getProjects(),
    getProfile(),
    getSettings(),
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
        {projects.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 border border-foreground/10 border-b-0 border-r-0">
            {projects.map((project) =>
              project.href ? (
                <a
                  href={project.href}
                  className="project-card"
                  key={project._id}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ProjectContent project={project} />
                </a>
              ) : (
                <article className="project-card" key={project._id}>
                  <ProjectContent project={project} />
                </article>
              ),
            )}
          </div>
        ) : (
          <p className="text-foreground/50">Henüz yayınlanmış proje yok.</p>
        )}
      </section>
    </main>
  );
}
