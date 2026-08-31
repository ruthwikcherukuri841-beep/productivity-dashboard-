import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { DashboardProvider } from "@/context/dashboard-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "DevPulse | Developer Productivity & Engineering Dashboard",
  description: "Next-generation engineering workspace for tracking sprints, pull requests, project health, and distributed systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 selection:text-white antialiased">
        <DashboardProvider>
          {children}
        </DashboardProvider>
      </body>
    </html>
  );
}
