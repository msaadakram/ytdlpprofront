import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

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
  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-extrabold text-foreground font-heading">Dashboard</h1>
        </div>
      </main>
      <Footer />
    </>
  );
}
