import React from 'react';
import { CheckCircle, Copy, FileText } from 'lucide-react';

interface VerifySectionProps {
  verifyId: string;
  setVerifyId: (id: string) => void;
  verifyResult: any; // Sebaiknya definisikan interface untuk hasil verifikasi jika memungkinkan
  setVerifyResult: (result: any) => void;
}

// Styles & Colors duplicated for modularity
const colors = {
  cardBg: 'bg-white',
};
const cardStyle = `border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg ${colors.cardBg} p-6 transition-all hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`;
const buttonStyle = `flex items-center justify-center gap-2 px-6 py-3 font-bold text-black border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all`;
const inputStyle = `w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white`;

export default function VerifySection({ verifyId, setVerifyId, verifyResult, setVerifyResult }: VerifySectionProps) {
  
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyId) return;

    // Simulasi hasil verifikasi
    // Jika ID mengandung "official", tampilkan mode Verified Issuer
    // Jika tidak, tampilkan mode Self-Signed
    const isOfficial = verifyId.toLowerCase().includes('univ');

    setVerifyResult({
        id: verifyId,
        title: isOfficial ? "Ijazah Sarjana Komputer" : "Surat Pernyataan Hak Cipta",
        issuer: isOfficial ? "Universitas Indonesia Maju" : "0x71C...9A23 (Self-Signed)",
        isVerifiedIssuer: isOfficial,
        date: "29 Nov 2025",
        type: isOfficial ? "Soulbound Token (SBT)" : "Standard NFT",
        hash: "QmX7y...9zK2"
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="mb-8 text-center">
          <h2 className="text-2xl font-black mb-2">Verifikasi Dokumen</h2>
          <p className="text-gray-600">Masukkan Token ID atau Hash Dokumen untuk mengecek validitasnya.</p>
       </div>

       <form onSubmit={handleVerify} className="relative mb-8">
          <input 
            type="text" 
            placeholder="Masukkan Token ID (Coba ketik 'univ' untuk simulasi resmi)" 
            className={`${inputStyle} pr-12`}
            value={verifyId}
            onChange={(e) => setVerifyId(e.target.value)}
          />
          <button type="submit" className="absolute right-2 top-2 bottom-2 rounded bg-black text-white px-4 font-bold hover:bg-gray-800 transition-colors">
            Cari
          </button>
       </form>

       {verifyResult && (
         <div className="animate-in slide-in-from-bottom-2">
            {/* Status Badge */}
            <div className={`mx-auto w-fit mb-[-20px] relative z-10 px-4 py-1 border-2 border-black rounded-full font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${verifyResult.isVerifiedIssuer ? 'bg-blue-400 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {verifyResult.isVerifiedIssuer ? 'OFFICIAL ISSUER' : 'PUBLIC MINT'}
            </div>

            <div className={`${cardStyle} pt-8 space-y-4`}>
                <div className="flex items-start justify-between border-b-2 border-gray-100 pb-4">
                    <div>
                        <h3 className="text-xl font-black">{verifyResult.title}</h3>
                        <div className="flex items-center gap-1 mt-1">
                            <span className="text-sm text-gray-500">Diterbitkan oleh:</span>
                            <span className="font-bold text-sm flex items-center gap-1">
                                {verifyResult.issuer}
                                {verifyResult.isVerifiedIssuer && <CheckCircle size={14} className="text-blue-500 fill-blue-100" />}
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className={`text-xs font-bold px-2 py-1 rounded border border-black ${verifyResult.type.includes('SBT') ? 'bg-yellow-200' : 'bg-cyan-200'}`}>
                            {verifyResult.type}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 p-3 rounded border border-gray-200">
                        <p className="text-xs text-gray-500 font-bold mb-1">TANGGAL CETAK</p>
                        <p className="font-mono">{verifyResult.date}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded border border-gray-200">
                        <p className="text-xs text-gray-500 font-bold mb-1">JARINGAN</p>
                        <p className="font-mono flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Arbitrum One</p>
                    </div>
                </div>

                <div className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-xs break-all relative group">
                    <p className="text-gray-500 mb-1 font-sans font-bold text-[10px] uppercase">IPFS Content Hash</p>
                    {verifyResult.hash}
                    <button className="absolute top-2 right-2 p-1 hover:bg-slate-700 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <Copy size={14}/>
                    </button>
                </div>

                <button className={`${buttonStyle} w-full bg-white text-sm py-2`}>
                   <FileText size={16} /> Lihat Dokumen Asli (PDF)
                </button>
            </div>
         </div>
       )}
    </div>
  );
}