import React from "react";
import { Lock, ArrowRightLeft } from "lucide-react";

interface HybridToggleProps {
  isSoulbound: boolean;
  setIsSoulbound: (value: boolean) => void;
}

export default function HybridToggle({ isSoulbound, setIsSoulbound }: HybridToggleProps) {
  const activeClass = "bg-yellow-300 translate-x-[2px] translate-y-[2px] shadow-none";
  const inactiveClass = "bg-white hover:bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Tombol SBT */}
      <button
        onClick={() => setIsSoulbound(true)}
        className={`relative overflow-hidden rounded-lg border-2 border-black p-4 text-left transition-all ${isSoulbound ? activeClass : inactiveClass}`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Lock size={20} />
          <span className="font-black text-sm">Soulbound (SBT)</span>
        </div>
        <p className="text-xs font-medium leading-tight">
          Permanen di wallet. Tidak bisa dipindah/dijual. Cocok untuk Ijazah/KTP.
        </p>
        {isSoulbound && <div className="absolute top-2 right-2 h-3 w-3 rounded-full bg-black animate-pulse"></div>}
      </button>

      {/* Tombol NFT */}
      <button
        onClick={() => setIsSoulbound(false)}
        className={`relative overflow-hidden rounded-lg border-2 border-black p-4 text-left transition-all ${!isSoulbound ? "bg-cyan-300 translate-x-[2px] translate-y-[2px] shadow-none" : inactiveClass}`}
      >
        <div className="flex items-center gap-2 mb-2">
          <ArrowRightLeft size={20} />
          <span className="font-black text-sm">Transferable</span>
        </div>
        <p className="text-xs font-medium leading-tight">
          Bebas dipindah-tangankan. Cocok untuk Tiket/Aset Bernilai.
        </p>
        {!isSoulbound && <div className="absolute top-2 right-2 h-3 w-3 rounded-full bg-black animate-pulse"></div>}
      </button>
    </div>
  );
}