import JsonLd from "../../components/JsonLd";
import { absoluteUrl, SITE_URL } from "../../lib/seo";
import { pageMetadata } from "../../lib/seo";
import Image from "next/image";
import type { Metadata } from "next";
import { getProfile, getSettings } from "../../sanity/content";
import PageHeader from "../../components/PageHeader";
import RichText from "../../components/RichText";
import { Skills, SocialLinks } from "../../components/ProfileDetails";
import {
  dictionaries,
  localizedPath,
} from "../../i18n/config";
import { getLocale, type LocaleProps } from "../../i18n/server";

export async function generateMetadata({
  params,
}: LocaleProps): Promise<Metadata> {
  const locale = await getLocale(params);
  const [profile, settings] = await Promise.all([getProfile(locale), getSettings(locale)]);
  return pageMetadata({ locale, path: "/about", title: dictionaries[locale].about, description: profile.introduction, profile, siteName: settings.siteTitle });
}

export default async function AboutPage({ params }: LocaleProps) {
  const locale = await getLocale(params);
  const t = dictionaries[locale];
  const profile = await getProfile(locale);
  return (
    <main className="flex flex-col">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "ProfilePage", url: absoluteUrl(localizedPath(locale, "/about")), inLanguage: locale, mainEntity: { "@id": SITE_URL + "/#person" } }} />
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
            <h1 className="text-3xl font-semibold">{t.about}</h1>
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
            <h2 className="text-xl font-semibold mb-4">{t.biography}</h2>
            <RichText value={profile.biography} />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">{t.education}</h2>
            <RichText value={profile.education} />
          </div>
        </div>
        <div className="flex flex-col gap-10">
          <div>
            <h2 className="text-xl font-semibold mb-4">{t.focus}</h2>
            <RichText value={profile.focus} />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">{t.techStack}</h2>
            <Skills items={profile.skills} />
          </div>
        </div>
      </section>
    </main>
  );
}
