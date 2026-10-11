"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "../i18n/config";

type Links = { pathname: string; paths: Record<Locale, string> };
const Context = createContext<{
  links: Links | null;
  setLinks: (value: Links | null) => void;
} | null>(null);

export function LanguageLinksProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [links, setLinks] = useState<Links | null>(null);
  return (
    <Context.Provider value={{ links, setLinks }}>{children}</Context.Provider>
  );
}

export function useLanguageLinks() {
  return useContext(Context)?.links;
}

export function ArticleLanguageLinks({
  paths,
}: {
  paths: Record<Locale, string>;
}) {
  const context = useContext(Context);
  const pathname = usePathname();
  const setLinks = context?.setLinks;
  const en = paths.en;
  const tr = paths.tr;
  useEffect(() => {
    setLinks?.({ pathname, paths: { en, tr } });
    return () => setLinks?.(null);
  }, [pathname, en, tr, setLinks]);
  return null;
}
