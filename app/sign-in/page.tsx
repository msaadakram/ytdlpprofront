import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en.json";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { AuthPage } from "@/components/auth/AuthPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: "en", namespace: "Auth" });
  return {
    title: `${t("signInTitle")} — DownForge`,
    alternates: { canonical: `https://www.downforge.me/sign-in` },
  };
}

export default async function SignInPage() {
  return (
    <NextIntlClientProvider messages={enMessages} locale="en">
<>
      <Nav />
      <main className="pt-20 pb-20 min-h-screen flex items-center">
        <AuthPage mode="signin" />
      </main>
      <Footer />
    </>
    </NextIntlClientProvider>
  );
}
