import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ClientLayout } from "./client";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat App",
  description: "A modern chat application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
      <Suspense fallback={<div>Loading Chat...</div>}>
      <ClientLayout>{children}</ClientLayout>
      </Suspense>
      </body>
    </html>
  );
}
