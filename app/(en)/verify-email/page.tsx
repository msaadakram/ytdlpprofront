import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en.json";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: "en", namespace: "Auth" });
  return {
    title: `${t("verifyTitle")} — DownForge`,
    alternates: { canonical: `https://www.downforge.me/verify-email` },
  };
}

export default function VerifyEmailPage() {
  return (
    <NextIntlClientProvider messages={enMessages} locale="en">
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
    </NextIntlClientProvider>
  );
}
