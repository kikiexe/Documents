import React from 'react';
import { Upload, FileText, X, Lock, Globe, CheckCircle } from 'lucide-react';

interface UploadSectionProps {
  file: File | null;
  setFile: (file: File | null) => void;
  tokenType: string;
  setTokenType: (type: string) => void;
  isMinting: boolean;
  setIsMinting: (isMinting: boolean) => void;
  mintSuccess: boolean;
  setMintSuccess: (success: boolean) => void;
  walletConnected: boolean;
  connectWallet: () => void;
}

// Styles & Colors duplicated for modularity
const colors = {
  primary: 'bg-[#fbbf24]',
  cardBg: 'bg-white',
};
const cardStyle = `border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg ${colors.cardBg} p-6 transition-all hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`;
const buttonStyle = `flex items-center justify-center gap-2 px-6 py-3 font-bold text-black border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all`;
const inputStyle = `w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white`;

export default function UploadSection({ 
  file, setFile, tokenType, setTokenType, 
  isMinting, setIsMinting, mintSuccess, setMintSuccess, 
  walletConnected, connectWallet 
}: UploadSectionProps) {
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleMint = () => {
    if (!walletConnected) {
        connectWallet();
        return;
    }
    setIsMinting(true);
    // Simulasi loading 2 detik
    setTimeout(() => {
      setIsMinting(false);
      setMintSuccess(true);
    }, 2500);
  };

  const reset = () => {
    setFile(null);
    setMintSuccess(false);
    setIsMinting(false);
  }

  if (mintSuccess) {
    return (
      <div className="animate-in zoom-in duration-300">
        <div className={`${cardStyle} text-center space-y-6`}>
           <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-black bg-green-400">
             <CheckCircle size={40} className="text-black" />
           </div>
           <div>
             <h2 className="text-2xl font-black text-black">Dokumen Berhasil Dicetak!</h2>
             <p className="text-gray-600 mt-2">Dokumen Anda telah tercatat kekal di Blockchain Arbitrum Sepolia.</p>
           </div>
           
           <div className="bg-gray-100 p-4 rounded border-2 border-black text-left text-sm font-mono break-all">
              <p className="text-xs text-gray-500 mb-1">Transaction Hash:</p>
              0x8f2d...3k12
              <div className="mt-3 flex items-center justify-between border-t border-gray-300 pt-2">
                 <span className="text-xs text-gray-500">Token ID: #8821</span>
                 <a href="#" className="text-blue-600 underline">View on Explorer</a>
              </div>
           </div>

           <button onClick={reset} className={`${buttonStyle} w-full bg-white`}>
             Upload Dokumen Lain
           </button>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 rounded-lg border-2 border-black bg-yellow-100 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-lg font-black flex items-center gap-2">
          <Upload size={20}/> Terbitkan Dokumen
        </h2>
        <p className="text-sm mt-1">Pastikan file PDF sudah benar. Dokumen tidak bisa diubah setelah dicetak.</p>
      </div>

      <div className={`${cardStyle} space-y-6`}>
        {/* Upload Area */}
        {!file ? (
          <div className="relative flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-black bg-gray-50 transition-colors hover:bg-gray-100">
             <input type="file" className="absolute h-full w-full cursor-pointer opacity-0" onChange={handleFileChange} accept=".pdf" />
             <div className="rounded-full bg-white p-3 border-2 border-black mb-2 shadow-sm">
                <FileText size={32} />
             </div>
             <p className="font-bold">Klik atau geser file PDF ke sini</p>
             <p className="text-xs text-gray-500 mt-1">Maksimal 5 MB</p>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-lg border-2 border-black bg-blue-50 p-4">
             <div className="flex items-center gap-3">
                <FileText size={24} />
                <div className="overflow-hidden">
                    <p className="font-bold truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} KB • Ready to upload</p>
                </div>
             </div>
             <button onClick={() => setFile(null)} className="rounded-full p-1 hover:bg-red-100 border border-transparent hover:border-black transition-all">
                <X size={20} />
             </button>
          </div>
        )}

        {/* Token Type Selection (The Core Innovation) */}
        <div>
           <label className="mb-2 block font-black">Pilih Jenis Token:</label>
           <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setTokenType('SBT')}
                className={`relative overflow-hidden rounded-lg border-2 border-black p-3 text-left transition-all ${tokenType === 'SBT' ? 'bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[1px] translate-y-[1px]' : 'bg-white hover:bg-gray-50'}`}
              >
                 <div className="flex items-center gap-2 mb-1">
                    <Lock size={16} />
                    <span className="font-bold">Soulbound (SBT)</span>
                 </div>
                 <p className="text-xs leading-tight">Tidak bisa dipindah/dijual. Cocok untuk Ijazah/KTP.</p>
                 {tokenType === 'SBT' && <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-black"></div>}
              </button>

              <button 
                onClick={() => setTokenType('NFT')}
                className={`relative overflow-hidden rounded-lg border-2 border-black p-3 text-left transition-all ${tokenType === 'NFT' ? 'bg-cyan-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[1px] translate-y-[1px]' : 'bg-white hover:bg-gray-50'}`}
              >
                 <div className="flex items-center gap-2 mb-1">
                    <Globe size={16} />
                    <span className="font-bold">Transferable</span>
                 </div>
                 <p className="text-xs leading-tight">Bisa dipindah/dijual. Cocok untuk Sertifikat Aset/Tiket.</p>
                 {tokenType === 'NFT' && <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-black"></div>}
              </button>
           </div>
        </div>

        {/* Metadata Inputs */}
        <div className="space-y-3">
            <div>
                <label className="block text-sm font-bold mb-1">Judul Dokumen</label>
                <input type="text" placeholder="Contoh: Ijazah S1 Teknik Informatika" className={inputStyle} />
            </div>
            <div>
                <label className="block text-sm font-bold mb-1">Deskripsi</label>
                <textarea rows={3} placeholder="Keterangan tambahan..." className={inputStyle}></textarea>
            </div>
        </div>

        {/* Cost & Action */}
        <div className="rounded-lg border-2 border-black bg-gray-50 p-4 text-sm flex justify-between items-center">
            <span className="font-bold text-gray-500">Estimasi Biaya:</span>
            <span className="font-black text-lg">0.0001 ETH <span className="text-xs font-normal text-gray-500">(~Rp 500)</span></span>
        </div>

        <button 
          onClick={handleMint}
          disabled={!file || isMinting}
          className={`${buttonStyle} w-full ${!file ? 'bg-gray-200 text-gray-400 border-gray-400 shadow-none cursor-not-allowed' : colors.primary}`}
        >
           {isMinting ? 'Sedang Memproses...' : (walletConnected ? 'Tanda Tangani & Cetak' : 'Hubungkan Wallet untuk Mencetak')}
        </button>
      </div>
    </div>
  );
}