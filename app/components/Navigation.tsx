"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { dictionaries, localizedPath, type Locale } from "../i18n/config";
import { useLanguageLinks } from "./LanguageLinks";

export default function Navigation({
  items,
  locale,
}: {
  items: { _key: string; label: string; href: string }[];
  locale: Locale;
}) {
  const pathName = localizedPath(locale, usePathname());
  const translations = useLanguageLinks();
  const otherLocale = locale === "en" ? "tr" : "en";
  const switchPath =
    translations?.pathname === pathName
      ? translations.paths[otherLocale]
      : localizedPath(otherLocale, pathName);
  const t = dictionaries[locale];

  const isActive = (href: string) => {
    if (href === localizedPath(locale)) return pathName === href;
    if (pathName == href || pathName.startsWith(href + "/")) return true;
  };

  return (
    <nav
      aria-label={t.navigation}
      className="flex items-center justify-around gap-2 fixed left-1/2 -translate-x-1/2 top-4 z-50 max-w-100 w-[calc(100%-2rem)] backdrop-blur-md bg-background/60 border border-white/10 rounded-3xl px-3 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
    >
      {items.map((item) => (
        <Link
          href={localizedPath(locale, item.href)}
          aria-current={
            isActive(localizedPath(locale, item.href)) ? "page" : undefined
          }
          className={
            isActive(localizedPath(locale, item.href))
              ? "nav-item active"
              : "nav-item"
          }
          key={item._key}
        >
          {item.label}
        </Link>
      ))}
      <Link
        href={switchPath}
        hrefLang={otherLocale}
        lang={otherLocale}
        aria-label={t.switchLanguage}
        className="text-xs font-medium border-l border-white/10 pl-3 text-foreground/60 hover:text-white"
        onClick={(event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
            return;
          const suffix = window.location.search + window.location.hash;
          if (suffix) {
            event.preventDefault();
            window.location.assign(switchPath + suffix);
          }
        }}
      >
        {otherLocale.toUpperCase()}
      </Link>
    </nav>
  );
}
