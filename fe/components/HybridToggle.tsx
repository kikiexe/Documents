import React from "react";

interface HybridToggleProps {
  isSoulbound: boolean;
  setIsSoulbound: (value: boolean) => void;
}

export default function HybridToggle({ isSoulbound, setIsSoulbound }: HybridToggleProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      
      {/* CARD 1: SOULBOUND (SBT) */}
      <div
        onClick={() => setIsSoulbound(true)}
        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col gap-3 group
          ${isSoulbound 
            ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600 shadow-md" 
            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"}`}
      >
        {/* Header Icon & Title */}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isSoulbound ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>
            {/* Lock Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <div>
            <h3 className={`font-bold text-sm ${isSoulbound ? "text-blue-900" : "text-gray-700"}`}>
              Dokumen Pribadi
            </h3>
            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              SBT Mode
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 leading-relaxed">
          Dokumen terkunci di wallet Anda. <br/>
          <span className="font-semibold">Tidak bisa dijual/ditransfer.</span>
          <br/>Cocok untuk: Ijazah, KTP, SK.
        </p>

        {/* Checkmark (Active State) */}
        {isSoulbound && (
          <div className="absolute top-3 right-3 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        )}
      </div>

      {/* CARD 2: TRANSFERABLE (NFT) */}
      <div
        onClick={() => setIsSoulbound(false)}
        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col gap-3 group
          ${!isSoulbound 
            ? "border-green-500 bg-green-50 ring-1 ring-green-500 shadow-md" 
            : "border-gray-200 hover:border-green-300 hover:bg-gray-50"}`}
      >
        {/* Header Icon & Title */}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${!isSoulbound ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}>
            {/* Exchange/Swap Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 10v12"></path>
              <path d="M15 10.5a2.5 2.5 0 0 1 5 0v10.5a2.5 2.5 0 0 1-5 0h-5"></path>
              <path d="M12 2a2.5 2.5 0 0 1 2.5 2.5v7.5"></path>
              <path d="M7 10a2.5 2.5 0 0 1-2.5-2.5V2.5A2.5 2.5 0 0 1 7 0h5"></path>
            </svg>
          </div>
          <div>
            <h3 className={`font-bold text-sm ${!isSoulbound ? "text-green-900" : "text-gray-700"}`}>
              Aset Digital
            </h3>
            <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              NFT Mode
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 leading-relaxed">
          Aset bebas dipindah-tangankan. <br/>
          <span className="font-semibold">Bisa dijual/dikirim ke orang lain.</span>
          <br/>Cocok untuk: Tiket, Karya Seni.
        </p>

        {/* Checkmark (Active State) */}
        {!isSoulbound && (
          <div className="absolute top-3 right-3 text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        )}
      </div>

    </div>
  );
}