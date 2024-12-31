import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import './globals.css';

export const metadata: Metadata = {
  title: "DayFlow",
  description: "Track your daily progress",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="antialiased bg-gradient-to-br from-black via-[#1c1c1e] to-black min-h-screen">
        {children}
      </body>
    </html>
  );
}
