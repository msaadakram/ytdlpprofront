import { ReactNode } from "react";
import "@/styles/globals.css";
import { AuthProvider } from "@/lib/auth-context";

export default function RootLayout({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
