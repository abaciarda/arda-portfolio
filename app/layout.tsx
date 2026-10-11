import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import { GoogleAnalytics } from "@next/third-parties/google";
import { getProfile, getSettings } from "./sanity/content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const defaultMetadata: Metadata = {
  metadataBase: new URL("https://ardaabaci.com"),
  title: {
    default: "Arda Abacı | Jr. Full-Stack Developer",
    template: "%s | Arda Abacı",
  },
  description:
    "Modern web teknolojileri ile geliştirilmiş kişisel portfolyo ve blog sitesi. React, Next.js ve Node.js projelerimi inceleyin.",
  keywords: [
    "Arda Abacı",
    "Full-Stack Developer",
    "Next.js",
    "React",
    "Node.js",
    "Web Developer",
    "Frontend",
    "Backend",
    "Portfolio",
    "Türkiye",
  ],
  authors: [{ name: "Arda Abacı", url: "https://ardaabaci.com" }],
  creator: "Arda Abacı",
  icons: {
    icon: [
      { url: "/assets/favicon.ico" },
      { url: "/assets/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/assets/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      {
        url: "/assets/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: ["/assets/favicon.ico"],
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://ardaabaci.com",
    title: "Arda Abacı | Jr. Full-Stack Developer",
    description:
      "Modern web teknolojileri ile geliştirilmiş kişisel portfolyo ve blog sitesi. React, Next.js ve Node.js projelerimi inceleyin.",
    siteName: "Arda Abacı Portfolyo",
    images: [
      {
        url: "/assets/images/avatar.jpeg",
        width: 800,
        height: 800,
        alt: "Arda Abacı Avatar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arda Abacı | Jr. Full-Stack Developer",
    description:
      "Modern web teknolojileri ile geliştirilmiş kişisel portfolyo ve blog sitesi.",
    images: ["/assets/images/avatar.jpeg"],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const [settings, profile] = await Promise.all([getSettings(), getProfile()]);
  return {
    ...defaultMetadata,
    title: { default: settings.siteTitle, template: `%s | ${profile.name}` },
    description: settings.description,
    authors: [{ name: profile.name, url: "https://ardaabaci.com" }],
    creator: profile.name,
    openGraph: {
      ...defaultMetadata.openGraph,
      title: settings.siteTitle,
      description: settings.description,
      images: [{ url: profile.avatar, alt: profile.name }],
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: settings.siteTitle,
      description: settings.description,
      images: [profile.avatar],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navigation items={settings.navigation} />
        {children}
      </body>
      <GoogleAnalytics gaId="G-PC1M1B3MJM" />
    </html>
  );
}
