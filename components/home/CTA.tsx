import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#0d1f26] rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #5baab8 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #a8d4dc 0%, transparent 70%)" }} />

          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 font-heading">
              Ready to start downloading?
            </h2>
            <p className="text-white/60 max-w-md mx-auto mb-8 font-sans">
              Join thousands of users who trust Fetchwave for their video downloads. No credit card required.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 bg-[#5baab8] text-white font-semibold text-sm px-7 py-3 rounded-xl hover:bg-[#4a99a7] transition-colors font-sans"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/api"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors font-sans"
              >
                API Access
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
