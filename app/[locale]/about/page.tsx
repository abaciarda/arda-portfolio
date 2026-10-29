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
  formatMonth,
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
            loading="eager"
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
            <h2 className="text-xl font-semibold mb-4">{t.focus}</h2>
            <RichText value={profile.focus} />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">{t.education}</h2>
            <RichText value={profile.education} />
          </div>
        </div>
        <div className="flex flex-col gap-10">
          {profile.experience?.length ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">{t.experience}</h2>
              <ol className="flex flex-col gap-8 border-l border-white/10">
                {profile.experience.map((item) => (
                  <li key={item._key} className="relative pl-6">
                    <span
                      aria-hidden="true"
                      className={`absolute -left-[4.5px] top-1 size-2 rounded-full ${
                        item.endDate
                          ? "bg-foreground/30"
                          : "bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                      }`}
                    />
                    <p className="font-mono text-[11px] uppercase tracking-wider text-foreground/40">
                      {formatMonth(item.startDate, locale)} —{" "}
                      {item.endDate ? formatMonth(item.endDate, locale) : t.present}
                    </p>
                    <h3 className="font-medium mt-1">{item.role}</h3>
                    <p className="text-sm text-foreground/60">
                      {[item.company, item.employmentType, item.location]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    {item.highlights?.length ? (
                      <ul className="mt-2 flex flex-col gap-1 text-sm text-foreground/50 font-light leading-relaxed">
                        {item.highlights.map((highlight) => (
                          <li key={highlight}>– {highlight}</li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
          <div>
            <h2 className="text-xl font-semibold mb-4">{t.techStack}</h2>
            <Skills items={profile.skills} />
          </div>
        </div>
      </section>
    </main>
  );
}
