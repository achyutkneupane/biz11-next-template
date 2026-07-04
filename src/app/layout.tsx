import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { serverFetchBusiness } from "@biz11/lib/server-bootstrap";

export async function generateMetadata(): Promise<Metadata> {
  const business = await serverFetchBusiness();
  const name = "data" in business ? business.data.name : "Biz11";

  return {
    title: {
      template: `%s - ${name}`,
      default: name,
    },
    description:
      "A modern multi-tenant e-commerce platform powering businesses worldwide.",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
