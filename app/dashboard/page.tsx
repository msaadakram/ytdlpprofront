import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en.json";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: "en", namespace: "Dashboard" });
  return {
    title: `${t("title")} — DownForge`,
    alternates: { canonical: `https://www.downforge.me/dashboard` },
  };
}

export default async function DashboardPage() {
  return (
    <NextIntlClientProvider messages={enMessages} locale="en">
      <DashboardClient />
    </NextIntlClientProvider>
  );
}
