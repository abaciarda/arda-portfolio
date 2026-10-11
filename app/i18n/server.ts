import "server-only";
import { notFound } from "next/navigation";
import { isLocale } from "./config";

export type LocaleProps = { params: Promise<{ locale: string }> };

export async function getLocale(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}
