import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Link } from "@/lib/i18n/navigation";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 px-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-6xl font-extrabold text-foreground mb-4 font-heading">404</h1>
          <p className="text-lg text-muted-foreground mb-8 font-sans">Page not found</p>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold bg-[#0d1f26] text-white px-6 py-3 rounded-full hover:bg-[#1a3545] transition-all font-sans">
            Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
