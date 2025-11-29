"use client";

import React from 'react';
import Link from 'next/link';
import { Shield, Upload, Search, Globe, Wallet } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Props definition for TypeScript
interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  walletConnected: boolean;
  walletAddress: string;
  connectWallet: () => void;
}

const colors = {
  primary: 'bg-[#fbbf24]', // Kuning/Emas Saweria
};

export default function Navbar({ activeTab, setActiveTab, walletConnected, walletAddress, connectWallet }: NavbarProps) {
  return (
    <>
      {/* Desktop & Mobile Top Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b-2 border-black bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div 
            className="flex cursor-pointer items-center gap-2"
            onClick={() => setActiveTab('home')}
          >
            {/* Logo Velipe ala Mascot */}
            <div className={`h-10 w-10 overflow-hidden rounded-full border-2 border-black ${colors.primary} flex items-center justify-center`}>
              <Shield className="h-6 w-6 text-black" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black tracking-tighter">VELIPE</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 font-bold text-sm">
            <button onClick={() => setActiveTab('home')} className={`hover:text-yellow-600 ${activeTab === 'home' ? 'underline decoration-2 underline-offset-4' : ''}`}>Beranda</button>
            <button onClick={() => setActiveTab('upload')} className={`hover:text-yellow-600 ${activeTab === 'upload' ? 'underline decoration-2 underline-offset-4' : ''}`}>Terbitkan Dokumen</button>
            <button onClick={() => setActiveTab('verify')} className={`hover:text-yellow-600 ${activeTab === 'verify' ? 'underline decoration-2 underline-offset-4' : ''}`}>Verifikasi</button>
          </div>

          {/* Wallet Button */}
          <button 
            onClick={connectWallet}
            className={`${walletConnected ? 'bg-green-300' : 'bg-white'} px-4 py-2 text-sm font-bold border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] transition-all`}
          >
            {walletConnected ? walletAddress : 'Connect Wallet'}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Bottom (Floating) */}
      <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
        <div className="flex justify-between rounded-xl border-2 border-black bg-white p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
           <button onClick={() => setActiveTab('home')} className={`flex-1 flex flex-col items-center p-2 rounded-lg ${activeTab === 'home' ? 'bg-yellow-100' : ''}`}>
             <Globe size={20} strokeWidth={2.5} />
             <span className="text-[10px] font-bold mt-1">Home</span>
           </button>
           <button onClick={() => setActiveTab('upload')} className={`flex-1 flex flex-col items-center p-2 rounded-lg ${activeTab === 'upload' ? 'bg-yellow-100' : ''}`}>
             <Upload size={20} strokeWidth={2.5} />
             <span className="text-[10px] font-bold mt-1">Upload</span>
           </button>
           <button onClick={() => setActiveTab('verify')} className={`flex-1 flex flex-col items-center p-2 rounded-lg ${activeTab === 'verify' ? 'bg-yellow-100' : ''}`}>
             <Search size={20} strokeWidth={2.5} />
             <span className="text-[10px] font-bold mt-1">Cek</span>
           </button>
        </div>
      </div>
    </>
  );
}