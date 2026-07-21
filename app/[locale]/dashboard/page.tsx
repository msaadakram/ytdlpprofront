import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Dashboard" });

  return {
    title: `${t("title")} — DownForge`,
    alternates: { canonical: `https://downforge.me/${locale}/dashboard` },
  };
}

export default async function DashboardPage({ params }: Props) {
  // Locale is validated by middleware; we just need to await it.
  await params;
  return <DashboardClient />;
}
