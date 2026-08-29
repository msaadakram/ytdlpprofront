import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { routing } from "@/lib/i18n/routing";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en") {
    return { alternates: { canonical: `https://www.downforge.me/verify-email` }, robots: { index: false, follow: false } };
  }
  const t = await getTranslations({ locale: "en", namespace: "Auth" });
  return {
    title: `${t("verifyTitle")} — DownForge`,
    alternates: { canonical: `https://www.downforge.me/verify-email` },
  };
}

export default function VerifyEmailPage() {
  return (
    <>
      <Nav />
      <main className="pt-20 pb-20 min-h-screen flex items-center">
        <div className="w-full max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="w-full max-w-[520px] mx-auto h-96 animate-pulse rounded-[2rem] bg-white/60 dark:bg-white/[0.04]" />}>
            <VerifyEmailForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
