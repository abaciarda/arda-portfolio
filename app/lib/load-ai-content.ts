import "server-only";
import { locales } from "../i18n/config";
import { getPosts, getProfile, getProjects, getSettings } from "../sanity/content";
import type { AiContent } from "./ai-content";

export async function loadAiContent(): Promise<AiContent[]> {
  return Promise.all(locales.map(async (locale) => {
    const [profile, settings, projects, posts] = await Promise.all([
      getProfile(locale), getSettings(locale), getProjects(locale), getPosts(locale),
    ]);
    return { locale, profile, settings, projects, posts };
  }));
}
