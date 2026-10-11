"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  defaultLocale,
  dictionaries,
  isLocale,
  localizedPath,
} from "../i18n/config";

export default function NotFound() {
  const params = useParams();
  const locale =
    typeof params.locale === "string" && isLocale(params.locale)
      ? params.locale
      : defaultLocale;
  const t = dictionaries[locale];
  return (
    <main className="container mx-auto px-4 py-40">
      <h1 className="text-3xl font-semibold">{t.notFound}</h1>
      <p className="mt-4 text-foreground/50">{t.notFoundDescription}</p>
      <Link
        className="inline-block mt-6 text-sky-400"
        href={localizedPath(locale)}
      >
        {t.backHome}
      </Link>
    </main>
  );
}
