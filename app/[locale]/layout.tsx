import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/auth-context";
import { routing } from "@/lib/i18n/routing";
import "@/styles/globals.css";
import { notFound } from "next/navigation";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "SEO" });
  const title = t("homeTitle");
  const description = t("homeDescription");
  const siteName = t("siteName");

  return {
    metadataBase: new URL("https://www.downforge.me"),
    title,
    description,
    applicationName: siteName,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
      shortcut: "/favicon.ico",
    },
    manifest: "/site.webmanifest",
    openGraph: {
      title,
      description,
      url: `https://www.downforge.me/${locale}`,
      siteName,
      locale,
      type: "website",
      images: [
        {
          url: "https://www.downforge.me/logo.png",
          width: 1254,
          height: 1254,
          alt: siteName,
        },
        {
          url: "https://www.downforge.me/android-chrome-512x512.png",
          width: 512,
          height: 512,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.downforge.me/logo.png"],
    },
    alternates: {
      canonical: `https://www.downforge.me/${locale}`,
      languages: {
        en: "https://www.downforge.me/en",
        es: "https://www.downforge.me/es",
        fr: "https://www.downforge.me/fr",
        de: "https://www.downforge.me/de",
        pt: "https://www.downforge.me/pt",
        ja: "https://www.downforge.me/ja",
        ar: "https://www.downforge.me/ar",
        ru: "https://www.downforge.me/ru",
        zh: "https://www.downforge.me/zh",
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export const viewport = {
  themeColor: "#0d1f26",
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DownForge",
    url: "https://www.downforge.me",
    logo: "https://www.downforge.me/organization-logo.png",
    image: "https://www.downforge.me/logo.png",
    description: "Download any video, audio, thumbnail or transcript from 200+ platforms",
    sameAs: [
      "https://github.com/downforge",
      "https://twitter.com/downforge",
      "https://facebook.com/downforge",
      "https://instagram.com/downforge",
      "https://linkedin.com/company/downforge",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DownForge",
    url: "https://www.downforge.me",
    inLanguage: locale,
    publisher: {
      "@type": "Organization",
      name: "DownForge",
      logo: {
        "@type": "ImageObject",
        url: "https://www.downforge.me/organization-logo.png",
        width: 512,
        height: 512,
        caption: "DownForge Logo",
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.downforge.me/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              {children}
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
              />
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
              />
            </AuthProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
