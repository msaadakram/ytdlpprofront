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

  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
    icons: {
      icon: "/logo.png",
      apple: "/logo.png",
    },
    openGraph: {
      title: t("homeTitle"),
      description: t("homeDescription"),
      type: "website",
      images: ["/logo.png"],
      locale,
      siteName: t("siteName"),
    },
    alternates: {
      canonical: `https://downforge.me/${locale}`,
      languages: {
        "en": "https://downforge.me/en",
        "es": "https://downforge.me/es",
        "fr": "https://downforge.me/fr",
        "de": "https://downforge.me/de",
        "pt": "https://downforge.me/pt",
        "ja": "https://downforge.me/ja",
        "ar": "https://downforge.me/ar",
        "ru": "https://downforge.me/ru",
        "zh": "https://downforge.me/zh",
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

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
            </AuthProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
