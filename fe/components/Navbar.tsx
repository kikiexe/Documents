"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => 
    pathname === path ? "text-blue-600 font-bold" : "text-gray-600 hover:text-blue-500";

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 text-white p-2 rounded-lg font-bold text-xl">
          TC
        </div>
        <span className="text-xl font-bold text-gray-800 tracking-tight">TrustChain</span>
      </div>

      <div className="flex gap-8 text-sm font-medium">
        <Link href="/" className={isActive("/")}>
          Beranda
        </Link>
        <Link href="/upload" className={isActive("/upload")}>
          Upload & Mint
        </Link>
        <Link href="/verify" className={isActive("/verify")}>
          Cek Keaslian
        </Link>
      </div>

      <div>
        <a 
          href="https://sepolia.arbiscan.io/" 
          target="_blank" 
          className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-200 transition"
        >
          Arbitrum Sepolia
        </a>
      </div>
    </nav>
  );
}