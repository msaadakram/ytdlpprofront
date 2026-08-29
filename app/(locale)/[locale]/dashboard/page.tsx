import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/lib/i18n/routing";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  // The dashboard is an auth-gated app page; keep it out of search indexes for
  // non-default locales whose canonical URL is the top-level /dashboard.
  if (locale !== "en") {
    return { alternates: { canonical: `https://www.downforge.me/dashboard` }, robots: { index: false, follow: false } };
  }
  const t = await getTranslations({ locale: "en", namespace: "Dashboard" });

  return {
    title: `${t("title")} — DownForge`,
    alternates: { canonical: `https://www.downforge.me/dashboard` },
  };
}

// Render the dashboard for every locale instead of redirecting to the
// locale-stripped /dashboard — a redirect here made the footer "Dashboard"
// link bounce (e.g. /es/dashboard -> /dashboard) and dropped the user's
// selected language.
export default async function DashboardPage() {
  return <DashboardClient />;
}
