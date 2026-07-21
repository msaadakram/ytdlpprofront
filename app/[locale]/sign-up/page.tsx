import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { AuthPage } from "@/components/auth/AuthPage";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth" });

  return {
    title: `${t("signUpTitle")} — DownForge`,
    alternates: { canonical: `https://downforge.me/${locale}/sign-up` },
  };
}

export default async function SignUpPage({ params }: Props) {
  return (
    <>
      <Nav />
      <main className="pt-20 pb-20 min-h-screen flex items-center">
        <AuthPage mode="signup" />
      </main>
      <Footer />
    </>
  );
}
