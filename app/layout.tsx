import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "fetchwave — Download any video, audio or thumbnail",
  description:
    "Paste a link from YouTube, Facebook, TikTok, Instagram and 200+ more. Get your file in seconds — no account required.",
  openGraph: {
    title: "fetchwave — Download any video, audio or thumbnail",
    description:
      "Paste a link from YouTube, Facebook, TikTok, Instagram and 200+ more. Get your file in seconds — no account required.",
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
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⬇️</text></svg>" />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
