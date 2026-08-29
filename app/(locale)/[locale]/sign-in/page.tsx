import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/lib/i18n/routing";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { AuthPage } from "@/components/auth/AuthPage";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  // Auth pages are app pages; keep non-default locales out of search indexes
  // since their canonical URL is the top-level /sign-in.
  if (locale !== "en") {
    return { alternates: { canonical: `https://www.downforge.me/sign-in` }, robots: { index: false, follow: false } };
  }
  const t = await getTranslations({ locale: "en", namespace: "Auth" });

  return {
    title: `${t("signInTitle")} — DownForge`,
    alternates: { canonical: `https://www.downforge.me/sign-in` },
  };
}

// Render the auth page for every locale instead of redirecting to the
// locale-stripped /sign-in, so navigation from localized pages keeps the
// user's selected language.
export default async function SignInPage() {
  return (
    <>
      <Nav />
      <main className="pt-20 pb-20 min-h-screen flex items-center">
        <AuthPage mode="signin" />
      </main>
      <Footer />
    </>
  );
}
