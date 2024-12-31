import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '../components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DayFlow',
  description: 'Track your daily progress and build better habits',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-gradient-to-br from-black to-[#1c1c1e]">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
