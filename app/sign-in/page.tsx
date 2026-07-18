import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { AuthPage } from "@/components/auth/AuthPage";

export const metadata: Metadata = {
  title: "Sign In — DownForge",
  description: "Sign in to your DownForge account to manage downloads, API keys, and billing.",
};

export default function SignInPage() {
  return (
    <>
      <Nav />
      <main className="pt-20 pb-20 min-h-screen flex items-center">
        <AuthPage mode="signin" />
      </main>
      <Footer />
    </>
  );
}
