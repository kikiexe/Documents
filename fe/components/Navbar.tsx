"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit"; // <-- Import Button Ajaib

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path
      ? "text-blue-600 font-bold border-b-2 border-blue-600"
      : "text-gray-600 hover:text-blue-500";

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-8 py-4 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo (Tetap sama) */}
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-2 rounded-xl font-bold text-xl shadow-lg">
            V
          </div>
          <div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              TrustChain
            </span>
          </div>
        </Link>

        {/* Menu (Tetap sama) */}
        <div className="flex gap-8 text-sm font-medium">
          <Link href="/" className={isActive("/")}>🏠 Beranda</Link>
          <Link href="/upload" className={isActive("/upload")}>📤 Upload</Link>
          <Link href="/verify" className={isActive("/verify")}>🔍 Verifikasi</Link>
          <Link href="/admin" className={isActive("/admin")}>👨‍💼 Admin</Link>
        </div>

        {/* CONNECT BUTTON RAINBOW KIT */}
        <div>
            <ConnectButton 
                showBalance={false} 
                accountStatus={{
                    smallScreen: 'avatar',
                    largeScreen: 'full',
                }}
            />
        </div>
      </div>
    </nav>
  );
}