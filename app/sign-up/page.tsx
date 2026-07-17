import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { AuthPage } from "@/components/auth/AuthPage";

export const metadata: Metadata = {
  title: "Sign Up — fetchwave",
  description: "Create your free fetchwave account. Download videos, audio, and thumbnails from 200+ platforms.",
};

export default function SignUpPage() {
  return (
    <>
      <Nav />
      <main className="pt-20 pb-20 min-h-screen flex items-center">
        <AuthPage mode="signup" />
      </main>
      <Footer />
    </>
  );
}
