import { ReactNode } from "react";
import "@/styles/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { ThemeAuthProvider } from "@/components/providers/ThemeAuthProvider";

async function getFallbackMessages() {
  try {
    return (await import("@/messages/en.json")).default;
  } catch {
    return {};
  }
}

export default async function ApiLayout({ children }: { children: ReactNode }) {
  const messages = await getFallbackMessages();
  return (
    <NextIntlClientProvider messages={messages} locale="en">
      <ThemeAuthProvider>{children}</ThemeAuthProvider>
    </NextIntlClientProvider>
  );
}
