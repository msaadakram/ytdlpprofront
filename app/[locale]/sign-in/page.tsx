import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { AuthPage } from "@/components/auth/AuthPage";

export function generateStaticParams() {
  return [{ locale: "en" }];
}

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en") {
    return { alternates: { canonical: `https://www.downforge.me/en/sign-in` }, robots: { index: false, follow: false } };
  }
  const t = await getTranslations({ locale: "en", namespace: "Auth" });

  return {
    title: `${t("signInTitle")} — DownForge`,
    alternates: { canonical: `https://www.downforge.me/en/sign-in` },
  };
}

export default async function SignInPage({ params }: Props) {
  const { locale } = await params;
  if (locale !== "en") redirect(`/en/sign-in`);
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
