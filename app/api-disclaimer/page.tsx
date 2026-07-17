import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "API Disclaimer — fetchwave",
  description: "Learn about fetchwave's API usage policies, fair use limits, and service terms.",
};

export default function ApiDisclaimerPage() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 font-sans">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <div className="bg-[#0d1f26] rounded-3xl p-8 md:p-12 mb-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#5baab8]/20 flex items-center justify-center mx-auto mb-5">
              <ShieldCheck className="w-7 h-7 text-[#5baab8]" />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 font-heading">API Disclaimer</h1>
            <p className="text-white/60 max-w-lg mx-auto font-sans">
              Important information about our API usage policies.
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3 font-heading">1. Fair Use Policy</h2>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                Our API is provided under a fair use policy. Free tier users are limited to 1,000 requests per day. Pro and Team tiers have higher limits as specified in your plan. Excessive usage that disrupts service for other users may result in rate limiting or temporary suspension.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3 font-heading">2. No Warranty</h2>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                The API is provided &ldquo;as is&rdquo; without warranty of any kind. We do not guarantee uninterrupted availability, accuracy of metadata, or compatibility with all video platforms. Platform APIs change frequently, and we cannot guarantee that all sources will remain accessible.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3 font-heading">3. Legal Compliance</h2>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                You are responsible for ensuring your use of the API complies with applicable laws and the terms of service of any platform you access through our service. Downloading copyrighted content without permission may violate copyright laws in your jurisdiction.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3 font-heading">4. Data Retention</h2>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                We do not store downloaded files permanently. Files are automatically deleted from our servers within 60 minutes of download. Metadata and usage logs may be retained for analytics and billing purposes.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3 font-heading">5. Rate Limits</h2>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                API endpoints are subject to rate limiting: 60 requests per minute globally, 30 per minute for info endpoints, and 20 per minute for download endpoints. Exceeding these limits will result in HTTP 429 responses.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
