import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/auth-context";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "DownForge — Download any video, audio, thumbnail or transcript",
  description:
    "Paste a link from YouTube, Facebook, TikTok, Instagram and 200+ more. Download video, audio, thumbnails, or AI transcripts — no account required.",
  openGraph: {
    title: "DownForge — Download any video, audio, thumbnail or transcript",
    description:
      "Paste a link from YouTube, Facebook, TikTok, Instagram and 200+ more. Download video, audio, thumbnails, or AI transcripts — no account required.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
