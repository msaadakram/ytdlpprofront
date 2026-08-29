import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { PlatformGrid } from "@/components/home/PlatformGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FormatShowcase } from "@/components/home/FormatShowcase";
import { FeaturesSection } from "@/components/home/Features";
import { Testimonials } from "@/components/home/Testimonials";
import { PricingSection } from "@/components/home/PricingSection";
import { CTA } from "@/components/home/CTA";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <PlatformGrid />
        <HowItWorks />
        <FormatShowcase />
        <FeaturesSection />
        <Testimonials />
        <PricingSection />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
