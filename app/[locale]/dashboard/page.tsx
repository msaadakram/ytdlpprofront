import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export function generateStaticParams() {
  return [{ locale: "en" }];
}

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en") {
    return { alternates: { canonical: `https://www.downforge.me/dashboard` }, robots: { index: false, follow: false } };
  }
  const t = await getTranslations({ locale: "en", namespace: "Dashboard" });

  return {
    title: `${t("title")} — DownForge`,
    alternates: { canonical: `https://www.downforge.me/dashboard` },
  };
}

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  redirect("/dashboard");
  return <DashboardClient />;
}
