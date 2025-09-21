import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CornerMarks from "@/components/CornerMarks";
import LightSnake from "@/components/LightSnake";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tom Seidel",
  description: "Personal website for Tom Seidel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}> 
        {/* Background effect */}
        <LightSnake />
        {/* Corner UI overlay */}
        <CornerMarks />
        <div className="min-h-dvh flex flex-col">
          {children}
          <footer className="relative mt-auto py-4 text-center text-xs text-white/30 pr-16 pl-16">
            © {new Date().getFullYear()} Tom Seidel |
            {" "}
            <Link href="/legal-notice" className="underline hover:text-white/60">
              Legal Notice
            </Link>
            <span
              aria-hidden
              className="absolute right-12 top-1/2 -translate-y-1/2 text-[10px] font-mono text-white/25 select-none"
            >
              v0.1
            </span>
          </footer>
        </div>
      </body>
    </html>
  );
}
