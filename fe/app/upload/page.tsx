"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { uploadFileToIPFS, uploadJSONToIPFS } from "@/utils/ipfs";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants";
import HybridToggle from "@/components/HybridToggle"; 

// Deklarasi global biar TS gak marah
declare global { interface Window { ethereum?: any; } }

export default function UploadPage() {
  const [account, setAccount] = useState<string>("");
  const [recipient, setRecipient] = useState<string>(""); 
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [isSoulbound, setIsSoulbound] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");

  // Koneksi Wallet
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask dulu!");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      setAccount(addr);
      setRecipient(addr); 
    } catch (error: any) { console.error(error); }
  };

  const switchWallet = async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({ method: "wallet_requestPermissions", params: [{ eth_accounts: {} }] });
      connectWallet();
    } catch (error) { console.log("Batal ganti akun"); }
  };

  const handleMint = async () => {
    if (!file || !account || !recipient) return alert("Data belum lengkap!");
    if (!ethers.isAddress(recipient)) return alert("Address Penerima Salah!");

    setLoading(true);
    setStatus("🚀 Memulai proses upload...");

    try {
      // 1. Upload ke IPFS
      setStatus("📦 Mengupload dokumen ke IPFS...");
      const fileCid = await uploadFileToIPFS(file);
      
      const metadata = {
        name: form.name,
        description: form.description,
        image: fileCid,
        attributes: [
          { trait_type: "Type", value: isSoulbound ? "Soulbound (SBT)" : "Transferable (NFT)" },
          { trait_type: "Issuer", value: account }
        ]
      };
      
      setStatus("📄 Membuat Metadata JSON...");
      const metadataCid = await uploadJSONToIPFS(metadata);

      // 2. Transaksi Blockchain
      setStatus("🦊 Menunggu konfirmasi MetaMask...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      let tx;
      try {
         // Coba Jalur Mitra
         tx = await contract.mintOfficialDocument(recipient, metadataCid, isSoulbound);
         setStatus("🏛️ Mencetak Dokumen Resmi (Verified)...");
      } catch (err) {
         console.log("Bukan Mitra, masuk jalur public...");
         // Jalur Public
         tx = await contract.mintPublicDocument(metadataCid, isSoulbound);
         setStatus("👤 Mencetak Dokumen Pribadi (Self-Signed)...");
      }

      await tx.wait();
      setStatus(`✅ SUKSES! Dokumen tercatat.`);
      alert("Minting Berhasil!");

    } catch (error: any) {
      setStatus("❌ Gagal: " + (error.reason || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            📄 Upload & Terbitkan Dokumen
          </h2>
        </div>
        
        <div className="p-8">
          {/* Wallet Control */}
          <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
            {!account ? (
              <button onClick={connectWallet} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                Hubungkan Wallet
              </button>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Terhubung sebagai:</p>
                  <p className="text-sm font-mono font-bold text-gray-800">{account.slice(0,6)}...{account.slice(-4)}</p>
                </div>
                <button onClick={switchWallet} className="text-xs bg-white border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-100 text-gray-700">
                  Ganti Akun
                </button>
              </div>
            )}
          </div>

          {/* Form Input */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Wallet Penerima</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-mono"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Judul Dokumen</label>
                    <input type="text" className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-900" placeholder="Ijazah / Sertifikat" onChange={(e) => setForm({...form, name: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">File PDF</label>
                    <input type="file" accept="application/pdf" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
                </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Deskripsi</label>
              <textarea className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-900" rows={3} placeholder="Keterangan tambahan..." onChange={(e) => setForm({...form, description: e.target.value})} />
            </div>

            <div className="pt-2">
               <label className="block text-sm font-bold text-gray-700 mb-2">Tipe Kepemilikan</label>
               <HybridToggle isSoulbound={isSoulbound} setIsSoulbound={setIsSoulbound} />
            </div>

            <button 
                onClick={handleMint} 
                disabled={loading || !account} 
                className={`w-full py-4 rounded-xl font-bold text-white text-lg transition shadow-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'}`}
            >
              {loading ? "Sedang Memproses..." : "Cetak Dokumen Sekarang"}
            </button>

            {status && (
                <div className={`mt-4 p-4 rounded-lg text-center text-sm font-medium ${status.includes("Gagal") ? "bg-red-50 text-red-700 border border-red-200" : "bg-blue-50 text-blue-700 border border-blue-200 animate-pulse"}`}>
                  {status}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}