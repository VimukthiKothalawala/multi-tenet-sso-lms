import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthHeader } from "@/components/auth-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LMS",
  description: "Teachers post content, students read it.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="flex items-center justify-between px-4 py-3 border-b">
          <span className="font-semibold">LMS</span>
          <AuthHeader />
        </header>
        {children}
      </body>
    </html>
  );
}
