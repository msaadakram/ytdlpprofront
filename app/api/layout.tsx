import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/auth-context";

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
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
