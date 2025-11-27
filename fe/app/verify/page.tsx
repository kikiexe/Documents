"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants";

// Definisikan tipe data untuk hasil verifikasi
interface DocData {
  owner: string;
  isSoulbound: boolean;
  isVerified: boolean;
  tokenURI: string;
  metadata?: any;
}

export default function VerifyPage() {
  const [tokenId, setTokenId] = useState("");
  const [data, setData] = useState<DocData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (!tokenId) return;
    setLoading(true);
    setError("");
    setData(null);

    try {
      // 1. Setup Provider (Read-Only, gak butuh wallet user)
      // Kita pakai RPC Publik Arbitrum Sepolia biar user gak perlu login MetaMask
      const provider = new ethers.JsonRpcProvider("https://sepolia-rollup.arbitrum.io/rpc");
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      // 2. Panggil Data dari Blockchain (Paralel biar cepat)
      // Kita ambil Owner, Status SBT, Status Verified, dan Link Metadata
      const [owner, isSBT, isVerif, uri] = await Promise.all([
        contract.ownerOf(tokenId),
        contract.isSoulbound(tokenId),
        contract.isVerifiedIssuer(tokenId),
        contract.tokenURI(tokenId)
      ]);

      // 3. Fetch Metadata dari IPFS (Isi JSON: Judul, Deskripsi, Gambar)
      // Kita ubah ipfs:// jadi https://gateway...
      const httpUri = uri.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
      const metaRes = await fetch(httpUri);
      const metadata = await metaRes.json();

      setData({
        owner,
        isSoulbound: isSBT,
        isVerified: isVerif,
        tokenURI: httpUri,
        metadata
      });

    } catch (err: any) {
      console.error(err);
      setError("Dokumen tidak ditemukan atau ID salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <div className="max-w-lg mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Verifikasi Dokumen</h1>
          <p className="text-gray-500 mt-2">Masukkan Token ID untuk mengecek keaslian dokumen di Blockchain.</p>
        </div>

        {/* Search Box */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 flex gap-2">
          <input 
            type="number" 
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
            placeholder="Contoh: 0, 1, 2..."
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
          />
          <button 
            onClick={handleVerify}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "🔍..." : "Cek"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-200 mb-6">
            ❌ {error}
          </div>
        )}

        {/* Result Card */}
        {data && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 animate-fade-in-up">
            
            {/* Status Banner */}
            <div className={`px-6 py-3 flex justify-between items-center ${data.isVerified ? "bg-green-100" : "bg-yellow-100"}`}>
              <span className={`font-bold text-sm flex items-center gap-2 ${data.isVerified ? "text-green-800" : "text-yellow-800"}`}>
                {data.isVerified ? "✅ VERIFIED ISSUER" : "⚠️ SELF-SIGNED (PUBLIC)"}
              </span>
              <span className="text-xs font-mono text-gray-600">ID: #{tokenId}</span>
            </div>

            <div className="p-6">
              {/* Judul & Deskripsi */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{data.metadata?.name || "Dokumen Tanpa Judul"}</h2>
              <p className="text-gray-600 text-sm mb-6">{data.metadata?.description}</p>

              {/* Detail Grid */}
              <div className="space-y-4">
                <DetailRow label="Pemilik (Owner)" value={data.owner} />
                
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Tipe Dokumen</span>
                  <span className={`text-sm font-bold px-2 py-1 rounded ${data.isSoulbound ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                    {data.isSoulbound ? "🔒 Soulbound (SBT)" : "💸 Transferable (NFT)"}
                  </span>
                </div>

                <div className="pt-4">
                  <p className="text-sm text-gray-500 mb-2">File Dokumen:</p>
                  <a 
                    href={data.metadata?.image?.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition"
                  >
                    📂 Lihat Dokumen Asli (IPFS)
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({label, value}: {label: string, value: string}) {
  return (
    <div className="py-2 border-b border-gray-100">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-xs font-mono text-gray-800 break-all">{value}</p>
    </div>
  )
}