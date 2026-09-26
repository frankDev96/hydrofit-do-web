import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { HydroProvider } from "@/components/hydro-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hydrofit.do Web",
  description:
    "HydroFit.do on the web. Log water, follow your daily plan, and review stats. Your data stays in this browser.",
  applicationName: "Hydrofit.do Web",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[var(--bg)] text-[var(--text)] antialiased">
        <HydroProvider>
          <AppShell>{children}</AppShell>
        </HydroProvider>
      </body>
    </html>
  );
}
