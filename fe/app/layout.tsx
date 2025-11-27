import type { Metadata } from "next";
import { Inter } from "next/font/google"; // 1. Import font Inter
import "./globals.css";
import Navbar from "@/components/Navbar";

// 2. Konfigurasi font
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TrustChain - Platform Autentikasi",
  description: "Verifikasi dokumen digital dengan Blockchain & IPFS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 3. Gunakan inter.className disini */}
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}