import Image from "next/image";
import type { Metadata } from "next";
import { getProfile } from "../sanity/content";
import PageHeader from "../components/PageHeader";
import RichText from "../components/RichText";
import { Skills, SocialLinks } from "../components/ProfileDetails";

export const metadata: Metadata = {
  title: "Hakkımda",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const profile = await getProfile();
  return (
    <main className="flex flex-col">
      <PageHeader>
        <div className="flex flex-col md:flex-row items-center gap-5">
          <Image
            src={profile.avatar}
            alt={profile.name}
            width={152}
            height={152}
            priority
            className="size-38 rounded-full object-cover"
          />
          <div>
            <h1 className="text-3xl font-semibold">Hakkımda</h1>
            <p className="text-lg text-foreground/50 font-extralight max-w-150 leading-relaxed mt-1">
              {profile.introduction}
            </p>
            <SocialLinks profile={profile} instagram />
          </div>
        </div>
      </PageHeader>
      <section className="container mx-auto py-12 px-4 grid md:grid-cols-2 gap-10 lg:gap-20">
        <div className="flex flex-col gap-10">
          <div>
            <h2 className="text-xl font-semibold mb-4">Hakkımda</h2>
            <RichText value={profile.biography} />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Eğitim</h2>
            <RichText value={profile.education} />
          </div>
        </div>
        <div className="flex flex-col gap-10">
          <div>
            <h2 className="text-xl font-semibold mb-4">Odak Alanlarım</h2>
            <RichText value={profile.focus} />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Tech Stack</h2>
            <Skills items={profile.skills} />
          </div>
        </div>
      </section>
    </main>
  );
}
