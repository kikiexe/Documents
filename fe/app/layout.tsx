import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Web3Provider } from "@/provider/wallet";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Velipe",
  description: "Verifikasi dokumen digital dengan Blockchain & IPFS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider> 
          <Navbar/>
          {children}
        </Web3Provider>
      </body>
      </html>
  );
}