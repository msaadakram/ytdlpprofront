"use client";

import { useEffect } from "react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { useRouter, usePathname } from "@/lib/i18n/navigation";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.error("Locale error:", error);
  }, [error]);

  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 px-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-lg">
          <h1 className="text-6xl font-extrabold text-foreground mb-4 font-heading">500</h1>
          <p className="text-lg text-muted-foreground mb-6 font-sans">
            Something went wrong while loading this page
          </p>
          <p className="text-sm text-muted-foreground mb-8 font-sans">
            This may happen when switching languages — try{" "}
            <button
              onClick={() => router.replace(pathname, { locale: "en" })}
              className="underline hover:text-foreground transition-colors"
            >
              switching back to English
            </button>{" "}
            or refreshing the page.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => router.replace(pathname, { locale: "en" })}
              className="inline-flex items-center gap-2 text-sm font-semibold bg-[#0d1f26] text-white px-6 py-3 rounded-full hover:bg-[#1a3545] transition-all font-sans"
            >
              Switch to English
            </button>
            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-2 text-sm font-semibold border border-[#0d1f26] text-[#0d1f26] px-6 py-3 rounded-full hover:bg-[#0d1f26] hover:text-white transition-all font-sans"
            >
              Try again
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
