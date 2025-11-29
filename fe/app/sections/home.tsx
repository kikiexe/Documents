import React from 'react';
import { Upload, Search, Lock, CheckCircle, Wallet } from 'lucide-react';

interface HomeSectionProps {
  changeTab: (tab: string) => void;
}

// Styles & Colors duplicated for modularity
const colors = {
  primary: 'bg-[#fbbf24]',
  secondary: 'bg-[#67e8f9]',
  accent: 'bg-[#f472b6]',
  cardBg: 'bg-white',
};

const cardStyle = `border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg ${colors.cardBg} p-6 transition-all hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`;
const buttonStyle = `flex items-center justify-center gap-2 px-6 py-3 font-bold text-black border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all`;

export default function HomeSection({ changeTab }: HomeSectionProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero Banner */}
      <div className={`relative overflow-hidden rounded-xl border-2 border-black ${colors.primary} p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}>
        {/* Decorative Circles */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border-2 border-black bg-white opacity-20"></div>
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full border-2 border-black bg-white opacity-20"></div>
        
        <div className="relative z-10 text-center">
          <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight text-black md:text-5xl">
            Notaris Digital <br/> Terdesentralisasi.
          </h1>
          <p className="mx-auto mb-6 max-w-md font-medium text-black">
            Platform autentikasi dokumen anti-palsu berbasis Blockchain. Amankan ijazah, sertifikat, dan aset digitalmu sekarang.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button 
              onClick={() => changeTab('upload')}
              className={`${buttonStyle} bg-white hover:bg-gray-50`}
            >
              <Upload size={20} /> Mulai Notarisasi
            </button>
            <button 
              onClick={() => changeTab('verify')}
              className={`${buttonStyle} ${colors.secondary} hover:brightness-110`}
            >
              <Search size={20} /> Cek Keaslian
            </button>
          </div>
        </div>
      </div>

      {/* Stats / Features Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Feature 1 */}
        <div className={cardStyle}>
          <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-black ${colors.secondary}`}>
            <Lock size={24} className="text-black" />
          </div>
          <h3 className="mb-2 text-lg font-black">SBT & NFT</h3>
          <p className="text-sm font-medium text-gray-600">
            Teknologi Hybrid Token. Pilih mode <b>Terkunci (Ijazah)</b> atau <b>Transferable (Tiket)</b> sesuai kebutuhan.
          </p>
        </div>

        {/* Feature 2 */}
        <div className={cardStyle}>
          <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-black ${colors.accent}`}>
            <CheckCircle size={24} className="text-black" />
          </div>
          <h3 className="mb-2 text-lg font-black">Terverifikasi</h3>
          <p className="text-sm font-medium text-gray-600">
            Dokumen dari institusi resmi mendapat tanda <span className="inline-block rounded bg-blue-500 px-1 py-0.5 text-[10px] text-white">Centang Biru</span>. Anti pemalsuan.
          </p>
        </div>

        {/* Feature 3 */}
        <div className={cardStyle}>
          <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-black bg-green-300`}>
            <Wallet size={24} className="text-black" />
          </div>
          <h3 className="mb-2 text-lg font-black">Hemat Biaya</h3>
          <p className="text-sm font-medium text-gray-600">
            Data disimpan di IPFS, bukti di Arbitrum. Biaya gas super murah (&lt;Rp 500) per dokumen.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="rounded-xl border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="mb-4 text-xl font-black">Cara Kerja Velipe</h2>
        <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg border-2 border-black bg-gray-50 p-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-black font-bold text-white">1</span>
                <p className="font-bold text-sm">Upload dokumen PDF kamu</p>
            </div>
            <div className="flex items-center gap-4 rounded-lg border-2 border-black bg-gray-50 p-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-black font-bold text-white">2</span>
                <p className="font-bold text-sm">Pilih tipe: Permanen (SBT) atau Aset (NFT)</p>
            </div>
            <div className="flex items-center gap-4 rounded-lg border-2 border-black bg-gray-50 p-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-black font-bold text-white">3</span>
                <p className="font-bold text-sm">Tanda tangan via Wallet & Minting!</p>
            </div>
        </div>
      </div>
    </div>
  );
}