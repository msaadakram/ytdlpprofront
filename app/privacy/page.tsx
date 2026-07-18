import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — DownForge",
  description: "DownForge privacy policy. Learn how we handle your data and what information we collect.",
};

export default function PrivacyPolicyPage() {
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
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 font-heading">Privacy Policy</h1>
            <p className="text-white/60 max-w-lg mx-auto font-sans">
              How we handle your data and protect your privacy.
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3 font-heading">1. Information We Collect</h2>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                We collect only the information necessary to provide our service: the URLs you submit for download, your IP address for rate limiting, and account information (email, name) if you create an account. We do not collect or store the actual content of your downloads beyond the processing period.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3 font-heading">2. How We Use Your Data</h2>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                URLs are used solely to process your download request and are deleted from our servers immediately after processing. Account information is used for authentication, billing, and communication about your account. We do not sell, trade, or share your personal data with third parties.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3 font-heading">3. Data Security</h2>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                We implement industry-standard security measures including encryption in transit (TLS), secure API authentication, and regular security audits. Downloaded files are stored temporarily in isolated storage and automatically purged.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3 font-heading">4. Cookies</h2>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                We use essential cookies for authentication and session management. Analytics cookies are used only with your consent. You can control cookie preferences through your browser settings.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3 font-heading">5. Your Rights</h2>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                You have the right to access, correct, or delete your personal data at any time. Contact us at privacy@downforge.me to exercise these rights. We will respond to your request within 30 days.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
