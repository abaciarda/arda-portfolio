export const locales = ["en", "tr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export function localizedPath(locale: Locale, path = "/") {
  const stripped = path.replace(/^\/(en|tr)(?=\/|$)/, "") || "/";
  return locale === "en" ? stripped : `/tr${stripped === "/" ? "" : stripped}`;
}

export function languageAlternates(path = "/") {
  return {
    canonical: path,
    languages: {
      en: localizedPath("en", path),
      tr: localizedPath("tr", path),
      "x-default": localizedPath("en", path),
    },
  };
}

export function formatDate(date: string, locale: Locale, short = false) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "tr-TR", {
    day: "numeric",
    month: short ? "short" : "long",
    ...(short ? {} : { year: "numeric" as const }),
    timeZone: "Europe/Istanbul",
  }).format(new Date(date));
}

export function formatMonth(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "tr-TR", {
    month: "short",
    year: "numeric",
    timeZone: "Europe/Istanbul",
  }).format(new Date(date));
}

export const dictionaries = {
  en: {
    home: "Home",
    about: "About Me",
    projects: "Projects",
    blog: "Blog",
    biography: "About Me",
    education: "Education",
    experience: "Experience",
    present: "Present",
    focus: "Focus Areas",
    techStack: "Tech Stack",
    myProjects: "My Projects",
    allProjects: "All projects",
    activity: "Recent Activity",
    activityUnavailable: "Recent activity is currently unavailable.",
    noProjects: "No projects have been published yet.",
    noPosts: "No posts have been published yet.",
    readArticle: "Read article",
    allPosts: "All posts",
    contents: "Contents",
    minutes: "min read",
    navigation: "Main navigation",
    switchLanguage: "Switch language",
    notFound: "Page not found",
    notFoundDescription: "The page you are looking for is unavailable.",
    backHome: "Back to home",
  },
  tr: {
    home: "Ana Sayfa",
    about: "Hakkımda",
    projects: "Projeler",
    blog: "Blog",
    biography: "Hakkımda",
    education: "Eğitim",
    experience: "Deneyim",
    present: "Günümüz",
    focus: "Odak Alanlarım",
    techStack: "Tech Stack",
    myProjects: "Projelerim",
    allProjects: "Tüm projeler",
    activity: "Son Etkinliklerim",
    activityUnavailable: "Son etkinlikler şu anda gösterilemiyor.",
    noProjects: "Henüz yayınlanmış proje yok.",
    noPosts: "Henüz yayınlanmış yazı yok.",
    readArticle: "Yazıyı oku",
    allPosts: "Tüm yazılar",
    contents: "İçindekiler",
    minutes: "dk okuma",
    navigation: "Ana gezinme",
    switchLanguage: "Dil değiştir",
    notFound: "Sayfa bulunamadı",
    notFoundDescription: "Aradığınız sayfaya ulaşılamıyor.",
    backHome: "Ana sayfaya dön",
  },
} as const;
